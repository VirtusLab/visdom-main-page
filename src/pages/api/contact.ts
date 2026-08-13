/**
 * POST /api/contact: the working-session form on the home page.
 *
 * Replaces a mailto: link. That link opened the OS mail client, which most
 * visitors do not have configured, so they saw an error and left; and because
 * nothing was ever submitted, the conversion never reached analytics either. The
 * form now posts here, and the client fires the GA4 event only once this reports
 * a delivery, so what analytics counts is deliveries rather than clicks.
 *
 * Same credential and sender as the Maturity Matrix advisory form: Mailchimp
 * Transactional on MAILCHIMP_API_KEY, from the verified send.virtuslab.com
 * domain. Recipients are that form's owners plus aklepacka. See src/lib/email.ts.
 *
 * This endpoint is unauthenticated and sends from a verified domain, so it is an
 * abuse target. The guards: nothing the caller types is ever echoed to an address
 * the caller chose, field lengths are capped, and submissions are rate limited
 * per IP and per email.
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

/** Where a local or preview submission goes instead of the owner list. */
const DEV_RECIPIENT = 'me@arturskowronski.com';

/**
 * Only hosts that are definitely not the real site count as development.
 * Deliberately a deny-list rather than an exact match on the canonical domain: a
 * production alias, a www host or a campaign domain must still reach the team.
 * Quietly routing a real lead to one personal inbox is the worse failure.
 */
function isDevHost(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.pages.dev')
    );
  } catch {
    return false;
  }
}

/** Caps, so one request cannot become megabytes of outbound mail. */
const LIMITS: Record<string, number> = { name: 120, company: 160, email: 254, message: 4000 };

/**
 * Best-effort rate limiting. In-memory, so per warm instance rather than global:
 * it stops a naive loop from one client without needing a KV store, and does not
 * pretend to be more than that. If this ever sees real abuse, move the counters
 * to a shared store.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/** Minimal page for a native form post, so the no-JS path is not raw JSON. */
function page(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<title>${title}</title><style>body{font:16px/1.6 system-ui,sans-serif;` +
      `max-width:34rem;margin:12vh auto;padding:0 1.5rem;color:#111}` +
      `a{color:#059669}</style></head><body><h1>${title}</h1><p>${body}</p>` +
      `<p><a href="/">Back to the Visdom site</a></p></body></html>`,
    {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    },
  );
}

function recipients(requestUrl: string): { to: string[]; mode: 'owners' | 'dev' } {
  const configured = serverEnv('CONTACT_NOTIFY_TO');
  if (configured) {
    const list = configured.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length) return { to: list, mode: 'owners' };
  }
  return isDevHost(requestUrl)
    ? { to: [DEV_RECIPIENT], mode: 'dev' }
    : { to: DEFAULT_RECIPIENTS, mode: 'owners' };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = contentType.includes('application/json');

  // A native form post (script blocked or errored) arrives urlencoded. Accept it
  // so the lead still lands, and answer in HTML rather than a bare JSON blob.
  const fields: Record<string, string> = {};
  try {
    if (wantsJson) {
      const body = (await request.json()) as Record<string, unknown>;
      for (const [k, v] of Object.entries(body)) if (typeof v === 'string') fields[k] = v;
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) if (typeof v === 'string') fields[k] = v;
    }
  } catch {
    return wantsJson
      ? json({ ok: false, error: 'Malformed request.' }, 400)
      : page('Something went wrong', 'We could not read that submission.', 400);
  }

  const str = (k: string) => {
    const raw = (fields[k] ?? '').trim();
    return raw.slice(0, LIMITS[k] ?? 40);
  };
  const name = str('name');
  const email = str('email');
  const company = str('company');
  const message = str('message');
  const locale = str('locale') || 'en';

  // Honeypot: hidden from people, filled by naive bots. 200 so the bot does not
  // retry, but `skipped` tells the client not to count a conversion for a request
  // that sent nothing. A false positive must not be recorded as a lead.
  if (str('website')) {
    return wantsJson
      ? json({ ok: true, skipped: true })
      : page('Thanks', 'Your request was received.');
  }

  if (!name) {
    return wantsJson
      ? json({ ok: false, error: 'Name required.' }, 400)
      : page('Name required', 'Please go back and add your name.', 400);
  }
  if (!email || !EMAIL_RE.test(email)) {
    return wantsJson
      ? json({ ok: false, error: 'Valid work email required.' }, 400)
      : page('Email required', 'Please go back and add a valid work email.', 400);
  }

  const ip = clientAddress || 'unknown';
  if (rateLimited(`ip:${ip}`) || rateLimited(`em:${email.toLowerCase()}`)) {
    console.warn(`[contact] rate limited ip=${ip}`);
    return wantsJson
      ? json({ ok: false, error: 'Too many requests. Please try again later.' }, 429)
      : page('Too many requests', 'Please try again in a few minutes.', 429);
  }

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
  const { to, mode } = recipients(request.url);
  console.log(`[contact] submission mode=${mode} recipients=${to.length} locale=${locale}`);

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
    return wantsJson
      ? json({ ok: false, error: 'We could not send your request right now.', ref }, 502)
      : page('We could not send that', `Please write to visdom@virtuslab.com. Reference ${ref}.`, 502);
  }
  if (delivered < to.length) {
    console.error(`[contact] partial delivery ${delivered}/${to.length} to=${to.join(',')}`);
  }

  // Confirmation to the visitor. Best effort: the lead is already with the team,
  // so a failure here must not turn a captured lead into a visible error.
  //
  // Fixed template on purpose. Nothing the caller typed is echoed here, because
  // this address is unverified: echoing `message` back would have let anyone use a
  // VirtusLab-verified sender to deliver arbitrary text to arbitrary people.
  try {
    await sendEmail({
      to: email,
      fromEmail,
      fromName,
      replyTo: 'visdom@virtuslab.com',
      subject: 'We got your request - Visdom by VirtusLab',
      text: [
        'Hi,',
        '',
        'Thanks for asking to see Visdom in action. An engineer from the team will',
        'reply within one business day to find a slot.',
        '',
        'If you need anything sooner, just reply to this email.',
        '',
        '--',
        'Visdom team, VirtusLab',
        'visdom@virtuslab.com',
      ].join('\n'),
    });
  } catch (e) {
    const ref = e instanceof EmailError ? e.ref : newErrorRef('CNT');
    console.error(`[contact] ${ref} confirmation to requester failed (non-fatal) to=${email}`);
  }

  return wantsJson ? json({ ok: true }) : page('Thanks', 'An engineer will reply within one business day.');
};

/** Anything but POST on this path is a mistake worth naming. */
export const ALL: APIRoute = () => json({ ok: false, error: 'Method not allowed.' }, 405);
