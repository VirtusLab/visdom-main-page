/**
 * Cloudflare Turnstile verification for the working-session form.
 *
 * HubSpot's own reCAPTCHA must stay off: this endpoint submits server-side, so a
 * captcha on the HubSpot form would reject every lead. Spam is handled here, by
 * verifying the widget token against siteverify before anything is written.
 *
 * The secret is read from process.env only. Do not reach for import.meta.env:
 * Astro inlines named secrets into the server bundle. See serverEnv in
 * src/lib/hubspot.ts.
 */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VERIFY_TIMEOUT_MS = 5_000;

function secret(): string | undefined {
  return typeof process !== 'undefined' && process.env ? process.env.TURNSTILE_SECRET_KEY : undefined;
}

export interface TurnstileResult {
  ok: boolean;
  /** True when no secret is configured, so verification was not attempted. */
  skipped?: boolean;
}

/** True when the endpoint can actually call siteverify. The site key is client-only. */
export function turnstileConfigured(): boolean {
  return Boolean(secret());
}

/**
 * Verify a widget token. Empty or rejected tokens fail closed.
 *
 * No secret: skip, so a local or preview build without keys still accepts a
 * submission. Production builds refuse to ship without the keys (scripts/check-env.mjs).
 */
export async function verifyTurnstile(
  { token, ip }: { token: string; ip?: string },
  deps?: { fetchImpl?: typeof fetch },
): Promise<TurnstileResult> {
  const key = secret();
  if (!key) return { ok: true, skipped: true };

  const response = token.trim();
  if (!response) return { ok: false };

  const body = new URLSearchParams();
  body.set('secret', key);
  body.set('response', response);
  if (ip && ip !== 'unknown') body.set('remoteip', ip);

  try {
    const fetchImpl = deps?.fetchImpl ?? fetch;
    const res = await fetchImpl(SITEVERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    const data = (await res.json()) as { success?: unknown };
    return { ok: data.success === true };
  } catch {
    // Timeout, network, or a non-JSON body: fail closed rather than let a bot
    // through because Cloudflare was briefly unreachable.
    return { ok: false };
  }
}
