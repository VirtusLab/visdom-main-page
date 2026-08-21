/**
 * POST /api/contact: the working-session form on the home page.
 *
 * Replaces a mailto: link. That link opened the OS mail client, which most
 * visitors do not have configured, so they saw an error and left; and because
 * nothing was ever submitted, the conversion never reached analytics either. The
 * form posts here, and the client fires the GA4 event only once this reports a
 * capture, so what analytics counts is captured leads rather than clicks.
 *
 * HubSpot is the destination, in two independent channels (see src/lib/hubspot.ts):
 *
 * 1. A form submission, which creates or updates the contact in the CRM. This is
 *    the durable record, and HubSpot's own form settings decide who gets notified
 *    and whether the visitor gets a follow-up. That copy and that routing belong
 *    to whoever owns the portal, not to this repo.
 * 2. Optionally, transactional Single-Send emails for the team notification and
 *    the visitor confirmation, for portals that have the transactional add-on.
 *
 * Either channel accepting the lead is a success, because losing the lead is the
 * only outcome worth failing the request over. Both failing returns 502 with a
 * ref, and the visitor is shown the mailto fallback.
 *
 * This endpoint is unauthenticated and triggers mail from a verified domain, so it
 * is an abuse target. The guards: Cloudflare Turnstile (verified here, not on the
 * HubSpot form), a honeypot, field lengths, and per-IP / per-email rate limits.
 * HubSpot's own reCAPTCHA must stay off: a server-side submit would fail it.
 */
import type { APIRoute } from 'astro';
import {
  HubSpotError,
  configSummary,
  formConfigured,
  newErrorRef,
  readCookie,
  sendTransactionalEmail,
  serverEnv,
  submitLead,
  transactionalEmailId,
} from '../../lib/hubspot';
import { allowedOrigin, pageUriOf, resolveSource } from '../../lib/source';
import { turnstileConfigured, verifyTurnstile } from '../../lib/turnstile';

export const prerender = false;

/**
 * Who the transactional team notification goes to, matching the Matrix advisory
 * form's list plus aklepacka. Overridable without a deploy via CONTACT_NOTIFY_TO
 * (comma-separated). The CRM notification is separate: that one is configured on
 * the HubSpot form itself.
 */
const DEFAULT_RECIPIENTS = [
  'askowronski@virtuslab.com',
  'mbrych@virtuslab.com',
  'torzechowski@virtuslab.com',
  'aklepacka@virtuslab.com',
];

/** Where a local or preview notification goes instead of the owner list. */
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


/** Applies the CORS headers to a response when the caller's origin is allowed. */
function withCors(request: Request, res: Response): Response {
  const origin = allowedOrigin(request.headers.get('origin'), serverEnv('CONTACT_ALLOWED_ORIGINS'));
  if (!origin) return res;
  res.headers.set('Access-Control-Allow-Origin', origin);
  // The allow-list varies the response, so a shared cache must not serve one
  // origin's headers to another.
  res.headers.set('Vary', 'Origin');
  return res;
}

/** The request facts src/lib/source.ts needs, pulled out so it stays testable. */
function ctxOf(request: Request) {
  return {
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    url: request.url,
  };
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

/**
 * Preflight. A JSON post from another origin triggers one, and it must answer
 * before the browser will send the real request. Only reachable for an origin
 * that is already on the allow-list; anything else gets no CORS headers and the
 * browser refuses on its own.
 */
export const OPTIONS: APIRoute = ({ request }) => {
  const origin = allowedOrigin(request.headers.get('origin'), serverEnv('CONTACT_ALLOWED_ORIGINS'));
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
};

export const POST: APIRoute = async (ctx) => withCors(ctx.request, await handlePost(ctx));

const handlePost: APIRoute = async ({ request, clientAddress }) => {
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

  // Widget token. Not via str(): that helper's default cap is 40 characters, and
  // a Turnstile token is far longer. The widget writes cf-turnstile-response on a
  // native post; the JS path sends turnstileToken.
  const turnstileToken = (fields.turnstileToken || fields['cf-turnstile-response'] || '')
    .trim()
    .slice(0, 4096);
  const captcha = await verifyTurnstile({ token: turnstileToken, ip });
  if (!captcha.ok) {
    return wantsJson
      ? json({ ok: false, error: 'Please complete the verification and try again.', captcha: true }, 400)
      : page(
          'Verification required',
          'Please go back, complete the verification, and submit again.',
          400,
        );
  }

  if (rateLimited(`ip:${ip}`) || rateLimited(`em:${email.toLowerCase()}`)) {
    console.warn(`[contact] rate limited ip=${ip}`);
    return wantsJson
      ? json({ ok: false, error: 'Too many requests. Please try again later.' }, 429)
      : page('Too many requests', 'Please try again in a few minutes.', 429);
  }

  // One id per submission, so a retried Single-Send is deduplicated by HubSpot
  // instead of arriving twice.
  const submissionId = crypto.randomUUID();
  const submittedAt = new Date().toISOString();
  const ctx = ctxOf(request);
  const pageUri = pageUriOf(ctx);
  const source = resolveSource(ctx, str('source'));
  const from = serverEnv('HUBSPOT_FROM') || undefined;

  // A preview or a localhost run must not write into the production CRM. The
  // emails still go out (to the dev recipient), so the path is exercised end to
  // end; only the contact record is held back. Set HUBSPOT_ALLOW_DEV_SUBMIT=1 to
  // test the real submission against a sandbox portal.
  const devRun = isDevHost(request.url) && !serverEnv('HUBSPOT_ALLOW_DEV_SUBMIT');

  const failures: HubSpotError[] = [];

  // 1. The CRM write. This is the lead.
  let captured = false;
  if (formConfigured() && !devRun) {
    try {
      await submitLead({
        email,
        name,
        company: company || undefined,
        message: message || undefined,
        locale,
        pageUri,
        // Carries the origin property into HubSpot without touching the form
        // itself. pageUri and pageName are submission context, not form fields,
        // so the same form serves every property and each lead still says where
        // it came from. pageUri is the one HubSpot surfaces most prominently, so
        // the label here is the readable backup rather than the only signal.
        pageName: `${source.label}: working session request`,
        ipAddress: ip,
        // Present only if the visitor has HubSpot tracking, which ties the
        // submission to their session. Absent is fine, not an error.
        hutk: readCookie(request.headers.get('cookie'), 'hubspotutk'),
      });
      captured = true;
    } catch (e) {
      if (e instanceof HubSpotError) failures.push(e);
      else console.error('[contact] unexpected error capturing the lead', String(e));
    }
  }

  // 2. The transactional team notification, for portals that have the add-on.
  // Delivery to at least one owner counts: losing one address must not lose the
  // lead. The summary is one custom property so a minimal template can print it,
  // with the individual values alongside for a template that wants to lay them
  // out itself.
  const notifyEmailId = transactionalEmailId('HUBSPOT_NOTIFY_EMAIL_ID');
  let notified = 0;
  if (notifyEmailId) {
    const { to, mode } = recipients(request.url);
    console.log(`[contact] notifying mode=${mode} recipients=${to.length} locale=${locale}`);

    const summary = [
      `New working-session request from the ${source.label}`,
      '',
      `Name:     ${name}`,
      `Email:    ${email}`,
      company ? `Company:  ${company}` : null,
      `Language: ${locale}`,
      `Source:   ${source.slug}`,
      `Page:     ${pageUri}`,
      '',
      message ? 'What they are trying to ship:' : null,
      message || null,
      message ? '' : null,
      `Timestamp: ${submittedAt}`,
    ]
      .filter((l) => l !== null)
      .join('\n');

    const results = await Promise.allSettled(
      to.map((addr, i) =>
        sendTransactionalEmail({
          to: addr,
          emailId: notifyEmailId,
          from,
          replyTo: email,
          sendId: `${submissionId}-notify-${i}`,
          // No contactProperties: the recipients here are our own people, and
          // this data belongs on the lead's record, not on theirs.
          customProperties: {
            summary,
            lead_name: name,
            lead_email: email,
            lead_company: company,
            lead_message: message,
            locale,
            source: source.slug,
            source_label: source.label,
            page_uri: pageUri,
            submitted_at: submittedAt,
          },
        }),
      ),
    );

    notified = results.filter((r) => r.status === 'fulfilled').length;
    for (const r of results) {
      if (r.status === 'rejected' && r.reason instanceof HubSpotError) failures.push(r.reason);
    }
    if (notified > 0 && notified < to.length) {
      console.error(`[contact] partial notification ${notified}/${to.length}`);
    }
  }

  if (!captured && notified === 0) {
    if (!formConfigured() && !notifyEmailId) {
      const ref = newErrorRef('CNT');
      console.error(
        `[contact] ${ref} no HubSpot channel configured. Set HUBSPOT_PORTAL_ID and ` +
          'HUBSPOT_FORM_GUID, or HUBSPOT_ACCESS_TOKEN and HUBSPOT_NOTIFY_EMAIL_ID.',
      );
      return wantsJson
        ? json({ ok: false, error: 'We could not send your request right now.', ref }, 502)
        : page('We could not send that', `Please write to visdom@virtuslab.com. Reference ${ref}.`, 502);
    }
    if (devRun && !notifyEmailId) {
      // Nothing was configured for this host to do. Say so plainly rather than
      // reporting a lead that does not exist, and keep it out of analytics.
      console.warn('[contact] dev host, CRM write skipped and no transactional template set');
      return wantsJson
        ? json({ ok: true, skipped: true, dev: true })
        : page('Thanks', 'Dev host: nothing was sent, and no lead was recorded.');
    }
    const first = failures[0];
    const ref = first?.ref ?? newErrorRef('CNT');
    console.error(`[contact] ${ref} HubSpot took nothing code=${first?.code ?? 'UNKNOWN'}`);
    return wantsJson
      ? json({ ok: false, error: 'We could not send your request right now.', ref }, 502)
      : page('We could not send that', `Please write to visdom@virtuslab.com. Reference ${ref}.`, 502);
  }

  console.log(
    `[contact] lead handled captured=${captured} notified=${notified} devRun=${devRun} ` +
      `locale=${locale} source=${source.slug}${source.declared ? '' : ' (derived)'}`,
  );

  // 3. Confirmation to the visitor. Best effort: the lead is already recorded, so
  // a failure here must not turn a captured lead into a visible error. Skipped
  // entirely when the HubSpot form already sends a follow-up, which is the usual
  // setup and the reason this template is optional.
  //
  // Fixed template on purpose, and only their first name is passed. Nothing else
  // the caller typed is echoed here, because this address is unverified: echoing
  // `message` back would let anyone use a VirtusLab-verified sender to deliver
  // arbitrary text to arbitrary people.
  const confirmEmailId = transactionalEmailId('HUBSPOT_CONFIRM_EMAIL_ID');
  if (confirmEmailId) {
    try {
      await sendTransactionalEmail({
        to: email,
        emailId: confirmEmailId,
        from,
        replyTo: 'visdom@virtuslab.com',
        sendId: `${submissionId}-confirm`,
        customProperties: { first_name: name.split(/\s+/)[0] ?? '', locale },
      });
    } catch (e) {
      const ref = e instanceof HubSpotError ? e.ref : newErrorRef('CNT');
      console.error(`[contact] ${ref} confirmation to requester failed (non-fatal)`);
    }
  }

  // The source is echoed back so the GA4 conversion is tagged with the same value
  // that reached HubSpot. The client declares a source, but the server is the one
  // that validates it and may fall back to the hostname, so letting the client
  // report its own guess would let the two systems disagree about the same lead.
  const body: Record<string, unknown> = { ok: true, source: source.slug };
  if (devRun) {
    // The UI still shows success, but no conversion is counted: PUBLIC_GA_ID
    // defaults to the production property, and a local test is not a lead.
    body.skipped = true;
    body.dev = true;
  }
  return wantsJson
    ? json(body)
    : page('Thanks', 'An engineer will reply within one business day.');
};

/**
 * GET /api/contact: health check for a RUNNING deployment.
 *
 * The build guard (scripts/check-env.mjs) proves the variables existed when the
 * deployment was built. This proves what the deployment actually received, which
 * is not the same thing: Vercel captures env vars at build time, so changing one
 * without redeploying leaves the old value live, and nothing says so out loud.
 * That gap shipped a form pointing at the wrong destination once already.
 *
 * Booleans only. It reports THAT a channel is configured, never which form or
 * which credential, so publishing it costs nothing an attacker did not already
 * know from the POST handler existing.
 *
 * 503 when no channel can accept a lead, so any uptime monitor pointed here
 * treats a silently broken form as an outage, which is what it is.
 */
export const GET: APIRoute = () => {
  const cfg = configSummary();
  return json(
    {
      ok: cfg.usable,
      configured: {
        form: cfg.form,
        notify: cfg.notify,
        confirm: cfg.confirm,
        token: cfg.token,
        captcha: turnstileConfigured(),
      },
      missing: cfg.missing,
    },
    cfg.usable ? 200 : 503,
  );
};

/** Anything but GET or POST on this path is a mistake worth naming. */
export const ALL: APIRoute = () => json({ ok: false, error: 'Method not allowed.' }, 405);
