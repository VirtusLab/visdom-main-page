/**
 * POST /api/contact: the working-session form on the home page.
 *
 * Replaces a mailto: link. That link opened the OS mail client, which most
 * visitors do not have configured, so they saw an error and left; and because
 * nothing was ever submitted, the conversion never reached analytics either. The
 * form now posts here, and the client fires the GA4 event only once this returns
 * ok, so what analytics counts is deliveries rather than clicks.
 *
 * Same credential and sender as the Maturity Matrix advisory form: Mailchimp
 * Transactional on MAILCHIMP_API_KEY, from the verified send.virtuslab.com
 * domain. Recipients are that form's owners plus aklepacka. See src/lib/email.ts.
 */
import type { APIRoute } from 'astro';
import { sendEmail, parseSender, EmailError, newErrorRef, serverEnv } from '../../lib/email';

export const prerender = false;

/**
 * The owners of this offer, matching the Matrix advisory form's list plus
 * aklepacka. Overridable without a deploy via CONTACT_NOTIFY_TO
 * (comma-separated).
 */
const DEFAULT_RECIPIENTS = [
  'askowronski@virtuslab.com',
  'mbrych@virtuslab.com',
  'torzechowski@virtuslab.com',
  'aklepacka@virtuslab.com',
];

/**
 * Anywhere that is not the production domain sends to one address instead of the
 * whole owner list, so a local or preview submission cannot page four people.
 * The Matrix does the same thing and dropping it here meant a local test landed
 * in three real inboxes.
 */
const DEV_RECIPIENT = 'me@arturskowronski.com';

function isProduction(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === 'visdom.virtuslab.com';
  } catch {
    return false;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function recipients(requestUrl: string): string[] {
  const configured = serverEnv('CONTACT_NOTIFY_TO');
  if (configured) {
    const list = configured.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length) return list;
  }
  return isProduction(requestUrl) ? DEFAULT_RECIPIENTS : [DEV_RECIPIENT];
}

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Malformed request.' }, 400);
  }

  const str = (k: string) => (typeof payload[k] === 'string' ? (payload[k] as string).trim() : '');
  const name = str('name');
  const email = str('email');
  const company = str('company');
  const message = str('message');
  const locale = str('locale') || 'en';

  // Honeypot: a field hidden from people and filled by naive bots. Answer 200 so
  // the bot records a success and does not retry, but send nothing.
  if (str('website')) return json({ ok: true });

  if (!name) return json({ ok: false, error: 'Name required.' }, 400);
  if (!email || !EMAIL_RE.test(email)) return json({ ok: false, error: 'Valid work email required.' }, 400);

  const from = serverEnv('ACCESS_REQUEST_FROM') || 'Visdom <noreply@send.virtuslab.com>';
  const { fromEmail, fromName } = parseSender(from);

  const text = [
    'New working-session request from the Visdom site',
    '',
    `Name:     ${name}`,
    `Email:    ${email}`,
    company ? `Company:  ${company}` : null,
    `Language: ${locale}`,
    '',
    message ? 'What they are trying to ship:' : null,
    message || null,
    message ? '' : null,
    `Timestamp: ${new Date().toISOString()}`,
  ]
    .filter((l) => l !== null)
    .join('\n');

  // The team notification IS the conversion, so a failure here fails the request
  // and the visitor is told to try again. One email per recipient because
  // sendEmail targets a single address, as in the Matrix. Delivery to at least
  // one owner counts as success: losing one address should not lose the lead.
  const to = recipients(request.url);
  const results = await Promise.allSettled(
    to.map((addr) =>
      sendEmail({
        to: addr,
        fromEmail,
        fromName,
        replyTo: email,
        subject: `Working session: ${name}${company ? ` - ${company}` : ''}`,
        text,
      }),
    ),
  );

  const delivered = results.filter((r) => r.status === 'fulfilled').length;
  if (delivered === 0) {
    const first = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
    const reason = first?.reason;
    const ref = reason instanceof EmailError ? reason.ref : newErrorRef('CNT');
    const code = reason instanceof EmailError ? reason.code : 'UNKNOWN';
    console.error(`[contact] ${ref} no recipient reached code=${code} to=${to.join(',')}`);
    return json(
      { ok: false, error: 'We could not send your request right now.', ref },
      502,
    );
  }
  if (delivered < to.length) {
    console.error(`[contact] partial delivery ${delivered}/${to.length} to=${to.join(',')}`);
  }

  // Confirmation to the visitor. Best effort: the lead is already with the team,
  // so a failure here must not turn a captured lead into a visible error.
  try {
    await sendEmail({
      to: email,
      fromEmail,
      fromName,
      replyTo: 'visdom@virtuslab.com',
      subject: 'We got your request - Visdom by VirtusLab',
      text: [
        `Hi ${name.split(/\s+/)[0]},`,
        '',
        'Thanks for asking to see Visdom in action. An engineer from the team will',
        'reply within one business day to find a slot.',
        '',
        message ? 'You told us:' : null,
        message || null,
        message ? '' : null,
        'If you need anything sooner, just reply to this email.',
        '',
        '--',
        'Visdom team, VirtusLab',
        'visdom@virtuslab.com',
      ]
        .filter((l) => l !== null)
        .join('\n'),
    });
  } catch (e) {
    const ref = e instanceof EmailError ? e.ref : newErrorRef('CNT');
    console.error(`[contact] ${ref} confirmation to requester failed (non-fatal) to=${email}`);
  }

  return json({ ok: true });
};

/** Anything but POST on this path is a mistake worth naming. */
export const ALL: APIRoute = () =>
  json({ ok: false, error: 'Method not allowed.' }, 405);
