/**
 * Transactional email, ported from the Maturity Matrix's
 * functions/api/_shared/email.ts so both properties send the same way, from the
 * same verified domain, on the same credential.
 *
 * Differences from the original: it runs on Vercel rather than Cloudflare Pages,
 * so the key comes from the process environment instead of a Workers `env`
 * binding, and there is no e2e outbox capture here.
 *
 * The key is read server-side only. It must never be exposed as PUBLIC_.
 */

/** Mailchimp Transactional (Mandrill). Same endpoint constant as the Matrix. */
const MAILCHIMP_SEND_URL = 'https://mandrillapp.com/api/1.4/messages/send';

/** Canonical sender. send.virtuslab.com is the domain verified in Mailchimp. */
const DEFAULT_FROM_EMAIL = 'noreply@send.virtuslab.com';
const DEFAULT_FROM_NAME = 'Visdom';

export type EmailErrorCode =
  | 'EMAIL_CONFIG_MISSING'
  | 'EMAIL_NETWORK_ERROR'
  | 'EMAIL_HTTP_ERROR'
  | 'EMAIL_BAD_RESPONSE'
  | 'EMAIL_REJECTED';

/**
 * Every failure mode carries a machine-readable code and a short ref that is
 * logged at throw time and shown to the user, so a reported "EML-1A2B3C4D"
 * points at exactly one log line.
 */
export class EmailError extends Error {
  readonly code: EmailErrorCode;
  readonly ref: string;
  readonly details?: unknown;
  constructor(code: EmailErrorCode, message: string, ref: string, details?: unknown) {
    super(message);
    this.name = 'EmailError';
    this.code = code;
    this.ref = ref;
    this.details = details;
  }
}

export function newErrorRef(prefix = 'ERR'): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/** Server-side env lookup. process.env at runtime, import.meta.env in dev. */
export function serverEnv(name: string): string | undefined {
  const fromProcess =
    typeof process !== 'undefined' && process.env ? process.env[name] : undefined;
  return fromProcess ?? (import.meta.env as Record<string, string | undefined>)[name];
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

/**
 * Sends one email. Resolves only on confirmed acceptance for the recipient and
 * throws EmailError (already logged) otherwise. Never a silent success: a
 * missing key, a network error, a non-2xx, a malformed body and a per-recipient
 * rejection all throw, because Mandrill returns rejections inside a 200.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  fromEmail,
  fromName,
  replyTo,
}: SendEmailInput): Promise<void> {
  const ctx = { to, subject };
  const key = serverEnv('MAILCHIMP_API_KEY');

  if (!key) {
    const ref = newErrorRef('EML');
    console.error(
      `[email] ${ref} EMAIL_CONFIG_MISSING MAILCHIMP_API_KEY not set`,
      JSON.stringify(ctx),
    );
    throw new EmailError('EMAIL_CONFIG_MISSING', 'Email service is not configured', ref);
  }

  console.log('[email] sending', JSON.stringify(ctx));

  let res: Response;
  try {
    res = await fetch(MAILCHIMP_SEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        message: {
          from_email: fromEmail || DEFAULT_FROM_EMAIL,
          from_name: fromName || DEFAULT_FROM_NAME,
          to: [{ email: to, type: 'to' }],
          subject,
          html,
          text,
          headers: replyTo ? { 'Reply-To': replyTo } : undefined,
        },
      }),
    });
  } catch (e) {
    const ref = newErrorRef('EML');
    console.error(`[email] ${ref} EMAIL_NETWORK_ERROR`, JSON.stringify({ ...ctx, error: String(e) }));
    throw new EmailError('EMAIL_NETWORK_ERROR', 'Could not reach the email service', ref, e);
  }

  if (!res.ok) {
    const ref = newErrorRef('EML');
    const body = await res.text().catch(() => '<unreadable>');
    console.error(
      `[email] ${ref} EMAIL_HTTP_ERROR status=${res.status}`,
      JSON.stringify({ ...ctx, status: res.status, body }),
    );
    throw new EmailError('EMAIL_HTTP_ERROR', `Email service returned HTTP ${res.status}`, ref, body);
  }

  let results: unknown;
  try {
    results = await res.json();
  } catch (e) {
    const ref = newErrorRef('EML');
    console.error(`[email] ${ref} EMAIL_BAD_RESPONSE could not parse JSON`, JSON.stringify(ctx));
    throw new EmailError('EMAIL_BAD_RESPONSE', 'Email service returned an unreadable response', ref, e);
  }

  if (!Array.isArray(results)) {
    const ref = newErrorRef('EML');
    console.error(`[email] ${ref} EMAIL_BAD_RESPONSE expected recipient array`, JSON.stringify({ ...ctx, results }));
    throw new EmailError('EMAIL_BAD_RESPONSE', 'Email service returned an unexpected response', ref, results);
  }

  const recipients = results as Array<{ status?: string }>;
  const failed = recipients.filter((r) => r.status === 'rejected' || r.status === 'invalid');
  if (failed.length > 0) {
    const ref = newErrorRef('EML');
    console.error(`[email] ${ref} EMAIL_REJECTED`, JSON.stringify({ ...ctx, failed }));
    throw new EmailError('EMAIL_REJECTED', 'Email was rejected by the provider', ref, failed);
  }

  console.log('[email] sent', JSON.stringify({ ...ctx, statuses: recipients.map((r) => r.status) }));
}

/**
 * Splits an "Name <addr@host>" sender string, the shape ACCESS_REQUEST_FROM uses
 * in the Matrix, into the pair sendEmail wants.
 */
export function parseSender(from: string): { fromEmail: string; fromName?: string } {
  const m = from.match(/^(.*)<(.+)>$/);
  return m
    ? { fromEmail: m[2].trim(), fromName: m[1].trim() || undefined }
    : { fromEmail: from.trim() };
}
