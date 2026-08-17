/**
 * HubSpot: lead capture and every email this site sends.
 *
 * Replaces Mailchimp Transactional (Mandrill). The switch changes the shape of
 * this module rather than just the URL, for two reasons:
 *
 * 1. HubSpot is a CRM first. The durable record of a lead is a contact, and the
 *    supported way to create one from a public page is a form submission. So the
 *    form submission is the primary write, and HubSpot's own form settings are
 *    what notify the team and send the visitor a follow-up. Marketing can change
 *    that copy and that routing without a deploy.
 * 2. HubSpot's transactional Single-Send API does not accept a message body. It
 *    sends a template that lives in HubSpot, addressed by numeric id, with values
 *    passed as custom properties (`{{ custom.NAME }}` in the template). So the
 *    copy moved out of this repo, and this module passes structured values
 *    instead of a rendered text block.
 *
 * Single-Send needs the transactional email add-on. The form submission does not,
 * so a portal without the add-on still captures every lead and still emails from
 * HubSpot, via the form's notification and follow-up settings. Callers treat the
 * two channels as independent and succeed when either one accepts the lead.
 *
 * Credentials are read server-side only. Never rename them to PUBLIC_.
 */

/** Public form submission host. Not the same host as the CRM API. */
const FORMS_HOST = 'https://api.hsforms.com';
const API_HOST = 'https://api.hubapi.com';
const SINGLE_SEND_PATH = '/marketing/v3/transactional/single-email/send';
const SEND_STATUS_PATH = '/marketing/v3/email/send-statuses';

/** Contact object type id. Every field we submit belongs to the contact. */
const CONTACT_OBJECT_TYPE_ID = '0-1';

/**
 * A visitor is waiting on this, so the budget is a wall clock rather than a count:
 * 8s per attempt, at most 3 attempts, and 12s for everything one exported call
 * does including its retries. Without the wall clock, three attempts inside three
 * recoverable submissions would add up to a minute and a half of a spinner.
 */
const REQUEST_TIMEOUT_MS = 8_000;
const CALL_BUDGET_MS = 12_000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 400;
/** HubSpot's own Retry-After can be long; cap what we are willing to wait. */
const MAX_RETRY_WAIT_MS = 2_000;
/** Response bodies go to logs, so keep them bounded. */
const LOG_BODY_CHARS = 500;

export type HubSpotErrorCode =
  | 'HUBSPOT_CONFIG_MISSING'
  | 'HUBSPOT_NETWORK_ERROR'
  | 'HUBSPOT_TIMEOUT'
  | 'HUBSPOT_HTTP_ERROR'
  | 'HUBSPOT_BAD_RESPONSE'
  | 'HUBSPOT_REJECTED';

/**
 * Every failure mode carries a machine-readable code and a short ref that is
 * logged at throw time and shown to the user, so a reported "HS-1A2B3C4D" points
 * at exactly one log line.
 */
export class HubSpotError extends Error {
  readonly code: HubSpotErrorCode;
  readonly ref: string;
  readonly details?: unknown;
  constructor(code: HubSpotErrorCode, message: string, ref: string, details?: unknown) {
    super(message);
    this.name = 'HubSpotError';
    this.code = code;
    this.ref = ref;
    this.details = details;
  }
}

export function newErrorRef(prefix = 'ERR'): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * Server-side env lookup, process.env only.
 *
 * Deliberately NOT falling back to `import.meta.env`. Astro's env plugin rewrites
 * a bare `import.meta.env` into an object literal carrying the values of every
 * key named anywhere in this module's source, so merely naming
 * HUBSPOT_ACCESS_TOKEN in an error message would be enough to bake the real
 * token into the built server bundle. That was verified with the previous
 * provider's key: it appeared verbatim in
 * .vercel/output/functions/_render.func. process.env is populated at runtime by
 * both `astro dev` and Vercel, so the fallback bought nothing.
 */
export function serverEnv(name: string): string | undefined {
  return typeof process !== 'undefined' && process.env ? process.env[name] : undefined;
}

/** Injected in tests. Production uses global fetch and a real timer. */
export interface HubSpotDeps {
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function backoffMs(attempt: number): number {
  // Exponential with jitter, so two retrying instances do not march in step.
  return RETRY_BASE_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * RETRY_BASE_MS);
}

function retryAfterMs(res: Response): number | undefined {
  const raw = res.headers.get('retry-after');
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (!Number.isFinite(seconds) || seconds < 0) return undefined;
  return Math.min(seconds * 1000, MAX_RETRY_WAIT_MS);
}

interface HubSpotResponse {
  status: number;
  body: unknown;
  raw: string;
}

/**
 * One HubSpot request, with a timeout and bounded retries.
 *
 * Retries cover only the cases where retrying is both safe and useful: a network
 * error or timeout, a 429, and a 5xx. A 4xx is a bug in what we sent, so it comes
 * straight back to the caller, body included, because the forms endpoint answers
 * a misconfigured field list that way and we act on it.
 *
 * Non-2xx is returned rather than thrown. Callers decide, because "400 with a
 * field-does-not-exist error" is recoverable and "400 anything else" is not.
 */
async function request(
  method: 'GET' | 'POST',
  url: string,
  payload: unknown,
  opts: {
    token?: string;
    label: string;
    ctx: Record<string, unknown>;
    deps: HubSpotDeps;
    /** Wall-clock cutoff for this call, retries included. */
    deadline: number;
  },
): Promise<HubSpotResponse> {
  const doFetch = opts.deps.fetchImpl ?? fetch;
  const sleep = opts.deps.sleep ?? realSleep;
  const { label, ctx, deadline } = opts;
  /** Room left in the budget, or false when it is spent. */
  const canRetry = (attempt: number) => attempt < MAX_ATTEMPTS && Date.now() < deadline;

  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await doFetch(url, {
        method,
        headers: {
          ...(payload === undefined ? {} : { 'Content-Type': 'application/json' }),
          // The token never reaches a log line: nothing here logs headers.
          ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
        },
        body: payload === undefined ? undefined : JSON.stringify(payload),
        signal: AbortSignal.timeout(
          Math.max(1_000, Math.min(REQUEST_TIMEOUT_MS, deadline - Date.now())),
        ),
      });
    } catch (e) {
      const name = e instanceof Error ? e.name : '';
      const timedOut = name === 'TimeoutError' || name === 'AbortError';
      if (canRetry(attempt)) {
        console.warn(`[hubspot] ${label} attempt ${attempt} failed (${name || 'error'}), retrying`);
        await sleep(backoffMs(attempt));
        continue;
      }
      const ref = newErrorRef('HS');
      console.error(
        `[hubspot] ${ref} ${timedOut ? 'HUBSPOT_TIMEOUT' : 'HUBSPOT_NETWORK_ERROR'} ${label}`,
        JSON.stringify({ ...ctx, attempts: attempt, error: String(e) }),
      );
      throw new HubSpotError(
        timedOut ? 'HUBSPOT_TIMEOUT' : 'HUBSPOT_NETWORK_ERROR',
        'Could not reach HubSpot',
        ref,
        e,
      );
    }

    const raw = await res.text().catch(() => '');

    if ((res.status === 429 || res.status >= 500) && canRetry(attempt)) {
      const wait = retryAfterMs(res) ?? backoffMs(attempt);
      console.warn(
        `[hubspot] ${label} attempt ${attempt} got HTTP ${res.status}, retrying in ${wait}ms`,
      );
      await sleep(wait);
      continue;
    }

    let body: unknown = undefined;
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = undefined;
      }
    }
    return { status: res.status, body, raw };
  }
}

function throwHttp(res: HubSpotResponse, label: string, ctx: Record<string, unknown>): never {
  const ref = newErrorRef('HS');
  console.error(
    `[hubspot] ${ref} HUBSPOT_HTTP_ERROR ${label} status=${res.status}`,
    JSON.stringify({ ...ctx, status: res.status, body: res.raw.slice(0, LOG_BODY_CHARS) }),
  );
  throw new HubSpotError(
    'HUBSPOT_HTTP_ERROR',
    `HubSpot returned HTTP ${res.status}`,
    ref,
    res.raw.slice(0, LOG_BODY_CHARS),
  );
}

function missingConfig(what: string, ctx: Record<string, unknown>): never {
  const ref = newErrorRef('HS');
  console.error(`[hubspot] ${ref} HUBSPOT_CONFIG_MISSING ${what}`, JSON.stringify(ctx));
  throw new HubSpotError('HUBSPOT_CONFIG_MISSING', 'HubSpot is not configured', ref);
}

// ── Transactional email (Single-Send API) ────────────────────────────────────

/**
 * A send HubSpot accepted. QUEUED is an accepted send that has not left yet, and
 * IDEMPOTENT_IGNORE means an earlier send with the same sendId already went out,
 * which is exactly what a retry should look like. Every other value in the
 * enumeration is a refusal (bounced before, unsubscribed, bad template, portal
 * over limit) and must not be reported as delivery.
 */
const ACCEPTED_SEND_RESULTS = new Set(['SENT', 'QUEUED', 'IDEMPOTENT_IGNORE']);

/** How hard we chase an unresolved send before accepting HubSpot's queue. */
const STATUS_POLL_ATTEMPTS = 2;
const STATUS_POLL_DELAY_MS = 500;

export interface TransactionalEmailInput {
  /** Recipient. Single-Send takes one address per call. */
  to: string;
  /** Numeric id of the transactional template in HubSpot's email tool. */
  emailId: number;
  /** Optional "Name <addr@host>" override. Unset, the template's sender is used. */
  from?: string;
  replyTo?: string;
  /**
   * Idempotency key. HubSpot answers IDEMPOTENT_IGNORE for a repeat, so a retry
   * after an ambiguous failure cannot send the same mail twice.
   */
  sendId?: string;
  /** Rendered into the template as `{{ custom.NAME }}`. */
  customProperties?: Record<string, string>;
  /** Written onto the contact record and available as `{{ contact.NAME }}`. */
  contactProperties?: Record<string, string>;
}

/**
 * Sends one transactional email. Resolves only when HubSpot accepted the send,
 * and throws HubSpotError (already logged) otherwise: a missing token, a network
 * error, a non-2xx, an unreadable body and a per-recipient refusal all throw,
 * because HubSpot reports a refusal inside a 200.
 */
export async function sendTransactionalEmail(
  input: TransactionalEmailInput,
  deps: HubSpotDeps = {},
): Promise<void> {
  const ctx = { to: input.to, emailId: input.emailId };
  const deadline = Date.now() + CALL_BUDGET_MS;
  const token = serverEnv('HUBSPOT_ACCESS_TOKEN');
  if (!token) missingConfig('HUBSPOT_ACCESS_TOKEN not set', ctx);

  console.log('[hubspot] sending', JSON.stringify(ctx));

  const res = await request(
    'POST',
    `${API_HOST}${SINGLE_SEND_PATH}`,
    {
      emailId: input.emailId,
      message: {
        to: input.to,
        from: input.from,
        // Both are arrays in the API, even for a single address.
        replyTo: input.replyTo ? [input.replyTo] : undefined,
        sendId: input.sendId,
      },
      contactProperties: input.contactProperties,
      customProperties: input.customProperties,
    },
    { token, label: 'single-send', ctx, deps, deadline },
  );

  if (res.status < 200 || res.status >= 300) throwHttp(res, 'single-send', ctx);

  const view = res.body as
    | { status?: string; sendResult?: string; statusId?: string }
    | undefined;
  if (!view || typeof view !== 'object' || typeof view.status !== 'string') {
    const ref = newErrorRef('HS');
    console.error(
      `[hubspot] ${ref} HUBSPOT_BAD_RESPONSE single-send`,
      JSON.stringify({ ...ctx, body: res.raw.slice(0, LOG_BODY_CHARS) }),
    );
    throw new HubSpotError('HUBSPOT_BAD_RESPONSE', 'HubSpot returned an unexpected response', ref);
  }

  // The send is asynchronous, so a fresh request can come back without a result.
  // Chase it briefly rather than guessing: a PREVIOUSLY_BOUNCED address must not
  // be reported to the caller as a delivery.
  let sendResult = view.sendResult;
  if (!sendResult && view.statusId) {
    sendResult = await pollSendStatus(view.statusId, token, ctx, deps, deadline);
  }

  if (sendResult && !ACCEPTED_SEND_RESULTS.has(sendResult)) {
    const ref = newErrorRef('HS');
    console.error(`[hubspot] ${ref} HUBSPOT_REJECTED`, JSON.stringify({ ...ctx, sendResult }));
    throw new HubSpotError('HUBSPOT_REJECTED', 'HubSpot rejected the send', ref, sendResult);
  }
  if (view.status === 'CANCELED') {
    const ref = newErrorRef('HS');
    console.error(`[hubspot] ${ref} HUBSPOT_REJECTED status=CANCELED`, JSON.stringify(ctx));
    throw new HubSpotError('HUBSPOT_REJECTED', 'HubSpot cancelled the send', ref, view.status);
  }

  if (!sendResult) {
    // HubSpot owns the queue from here, so this counts as accepted. Logged as its
    // own line because it is the one path where we report success without a
    // per-recipient result.
    console.warn(
      '[hubspot] accepted, result still pending',
      JSON.stringify({ ...ctx, status: view.status, statusId: view.statusId }),
    );
    return;
  }

  console.log('[hubspot] sent', JSON.stringify({ ...ctx, sendResult }));
}

async function pollSendStatus(
  statusId: string,
  token: string,
  ctx: Record<string, unknown>,
  deps: HubSpotDeps,
  deadline: number,
): Promise<string | undefined> {
  const sleep = deps.sleep ?? realSleep;
  for (let attempt = 1; attempt <= STATUS_POLL_ATTEMPTS; attempt++) {
    await sleep(STATUS_POLL_DELAY_MS);
    let res: HubSpotResponse;
    try {
      res = await request(
        'GET',
        `${API_HOST}${SEND_STATUS_PATH}/${encodeURIComponent(statusId)}`,
        undefined,
        { token, label: 'send-status', ctx, deps, deadline },
      );
    } catch {
      // The send itself was accepted; failing to read its status is not a reason
      // to report the send as failed.
      return undefined;
    }
    if (res.status < 200 || res.status >= 300) return undefined;
    const view = res.body as { sendResult?: string } | undefined;
    if (view && typeof view.sendResult === 'string') return view.sendResult;
  }
  return undefined;
}

// ── Lead capture (Forms submission API) ──────────────────────────────────────

export interface LeadInput {
  email: string;
  /** Full name as typed. Split here because HubSpot stores the two halves. */
  name?: string;
  company?: string;
  message?: string;
  /** Two-letter page language, written to hs_language when it looks like one. */
  locale?: string;
  pageUri?: string;
  pageName?: string;
  /** Caller IP, for HubSpot's own analytics. Skipped when it is not an address. */
  ipAddress?: string;
  /** The hubspotutk cookie, which ties the submission to the visitor's session. */
  hutk?: string;
}

export interface LeadResult {
  /** Fields the form does not define, dropped so the lead still lands. */
  droppedFields: string[];
}

const LOCALE_RE = /^[a-z]{2}(-[a-z]{2})?$/i;
const IPV4_RE = /^\d{1,3}(\.\d{1,3}){3}$/;

/**
 * Strip control characters, then cap. HubSpot stores these values verbatim and
 * renders them into emails and CRM records, so nothing exotic gets through.
 * Newlines survive, because the message field is genuinely multi-line.
 */
function clean(value: string, max: number): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
}

function splitName(name: string): { firstname: string; lastname?: string } {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { firstname: parts[0] ?? '' };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
}

function leadFields(lead: LeadInput): Array<{ objectTypeId: string; name: string; value: string }> {
  const fields: Array<{ objectTypeId: string; name: string; value: string }> = [
    { objectTypeId: CONTACT_OBJECT_TYPE_ID, name: 'email', value: clean(lead.email, 254) },
  ];
  if (lead.name) {
    const { firstname, lastname } = splitName(clean(lead.name, 120));
    if (firstname) fields.push({ objectTypeId: CONTACT_OBJECT_TYPE_ID, name: 'firstname', value: firstname });
    if (lastname) fields.push({ objectTypeId: CONTACT_OBJECT_TYPE_ID, name: 'lastname', value: lastname });
  }
  if (lead.company) {
    fields.push({ objectTypeId: CONTACT_OBJECT_TYPE_ID, name: 'company', value: clean(lead.company, 160) });
  }
  if (lead.message) {
    fields.push({ objectTypeId: CONTACT_OBJECT_TYPE_ID, name: 'message', value: clean(lead.message, 4000) });
  }
  if (lead.locale && LOCALE_RE.test(lead.locale)) {
    fields.push({ objectTypeId: CONTACT_OBJECT_TYPE_ID, name: 'hs_language', value: lead.locale.toLowerCase() });
  }
  return fields;
}

/**
 * Consent, only when a subscription type is configured. HubSpot requires
 * legalConsentOptions on a GDPR-enabled form and rejects the submission without
 * it. Legitimate interest, basis LEAD, is the honest description of someone who
 * asked us for a working session: it records the request, it does not claim they
 * opted in to marketing.
 */
function legalConsent(): unknown {
  const raw = serverEnv('HUBSPOT_SUBSCRIPTION_TYPE_ID');
  const subscriptionTypeId = raw ? Number(raw) : NaN;
  if (!Number.isFinite(subscriptionTypeId)) return undefined;
  return {
    legitimateInterest: {
      value: true,
      subscriptionTypeId,
      legalBasis: 'LEAD',
      text: 'Submitted the working session request form on the Visdom site.',
    },
  };
}

/** Names HubSpot quoted back at us in a field error, e.g. `"message"`. */
function unknownFieldNames(body: unknown): string[] {
  const errors = (body as { errors?: Array<{ message?: string }> } | undefined)?.errors;
  if (!Array.isArray(errors)) return [];
  const names = new Set<string>();
  for (const err of errors) {
    if (typeof err?.message !== 'string') continue;
    if (!/does not exist/i.test(err.message)) continue;
    for (const m of err.message.matchAll(/"([^"]+)"/g)) names.add(m[1]);
  }
  return [...names];
}

/**
 * Submits the lead to a HubSpot form, which is what creates or updates the
 * contact and triggers whatever that form is set up to send.
 *
 * Two recoveries, both because losing a lead is the worst outcome here:
 *
 * - The authenticated endpoint needs the `forms` scope. A token issued only for
 *   transactional email answers 401 or 403, so fall back to the public endpoint,
 *   which is the one a browser would have posted to anyway.
 * - A form missing an optional field (message, hs_language) fails the whole
 *   submission with 400. Drop the fields HubSpot names and submit again, so a
 *   half-configured form still captures name, email and company.
 */
export async function submitLead(lead: LeadInput, deps: HubSpotDeps = {}): Promise<LeadResult> {
  const ctx = { email: lead.email };
  const deadline = Date.now() + CALL_BUDGET_MS;
  const portalId = serverEnv('HUBSPOT_PORTAL_ID');
  const formGuid = serverEnv('HUBSPOT_FORM_GUID');
  if (!portalId || !formGuid) {
    missingConfig('HUBSPOT_PORTAL_ID or HUBSPOT_FORM_GUID not set', ctx);
  }

  const token = serverEnv('HUBSPOT_ACCESS_TOKEN');
  const secureUrl = `${FORMS_HOST}/submissions/v3/integration/secure/submit/${portalId}/${formGuid}`;
  const publicUrl = `${FORMS_HOST}/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  const context: Record<string, string> = {};
  if (lead.hutk) context.hutk = lead.hutk;
  if (lead.pageUri) context.pageUri = lead.pageUri;
  if (lead.pageName) context.pageName = lead.pageName;
  // A non-address such as "unknown" is rejected, and IPv6 is not accepted here.
  if (lead.ipAddress && IPV4_RE.test(lead.ipAddress)) context.ipAddress = lead.ipAddress;

  let fields = leadFields(lead);
  const droppedFields: string[] = [];
  let url = token ? secureUrl : publicUrl;
  let useToken = Boolean(token);

  // At most three shots: the original, one after an auth fallback, one after
  // dropping fields the form does not define.
  for (let attempt = 1; attempt <= 3; attempt++) {
    const payload = {
      fields,
      context: Object.keys(context).length ? context : undefined,
      legalConsentOptions: legalConsent(),
      submittedAt: Date.now(),
    };
    const res = await request('POST', url, payload, {
      token: useToken ? token : undefined,
      label: 'form-submit',
      ctx,
      deps,
      deadline,
    });

    if (res.status >= 200 && res.status < 300) {
      console.log(
        '[hubspot] lead captured',
        JSON.stringify({ ...ctx, fields: fields.length, dropped: droppedFields }),
      );
      return { droppedFields };
    }

    if ((res.status === 401 || res.status === 403) && useToken) {
      console.warn(
        `[hubspot] form-submit got HTTP ${res.status} with a token, retrying unauthenticated. ` +
          'Add the forms scope to the private app to use the authenticated endpoint.',
      );
      url = publicUrl;
      useToken = false;
      continue;
    }

    if (res.status === 400) {
      const unknown = unknownFieldNames(res.body).filter((n) => n !== 'email');
      const known = new Set(fields.map((f) => f.name));
      const toDrop = unknown.filter((n) => known.has(n));
      if (toDrop.length) {
        console.error(
          '[hubspot] form is missing fields, dropping them and retrying',
          JSON.stringify({ ...ctx, dropped: toDrop }),
        );
        droppedFields.push(...toDrop);
        fields = fields.filter((f) => !toDrop.includes(f.name));
        continue;
      }
    }

    throwHttp(res, 'form-submit', ctx);
  }

  // Only reachable if every attempt was a recoverable failure.
  const ref = newErrorRef('HS');
  console.error(`[hubspot] ${ref} HUBSPOT_HTTP_ERROR form-submit exhausted retries`, JSON.stringify(ctx));
  throw new HubSpotError('HUBSPOT_HTTP_ERROR', 'HubSpot rejected the submission', ref);
}

/** True when a transactional template id is configured and usable. */
export function transactionalEmailId(name: 'HUBSPOT_NOTIFY_EMAIL_ID' | 'HUBSPOT_CONFIRM_EMAIL_ID'): number | undefined {
  const raw = serverEnv(name);
  if (!raw) return undefined;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    console.error(`[hubspot] ${name} is not a numeric template id, ignoring it`);
    return undefined;
  }
  return id;
}

/** True when the form submission channel is configured. */
export function formConfigured(): boolean {
  return Boolean(serverEnv('HUBSPOT_PORTAL_ID') && serverEnv('HUBSPOT_FORM_GUID'));
}

export interface ConfigSummary {
  /** The CRM write is possible. Without it a lead has nowhere durable to go. */
  form: boolean;
  /** Optional transactional channels. */
  notify: boolean;
  confirm: boolean;
  token: boolean;
  /** True when at least one channel can accept a lead. */
  usable: boolean;
  /** Names of the variables that are missing and would matter. */
  missing: string[];
}

/**
 * What this instance can actually do with a lead, as booleans only.
 *
 * Deliberately free of values: it is reported over HTTP by the health check on
 * GET /api/contact and printed by the build guard, so it must never leak a
 * credential or the form id. Knowing THAT a form is configured is harmless;
 * knowing WHICH form would hand the endpoint to spammers.
 *
 * This exists because the failure that actually hurt was silent. The contact form
 * returned 502 for three days with nobody watching the logs, because a working
 * deployment and a configured deployment look identical from the outside.
 */
export function configSummary(): ConfigSummary {
  const form = formConfigured();
  const notify = Boolean(serverEnv('HUBSPOT_NOTIFY_EMAIL_ID'));
  const confirm = Boolean(serverEnv('HUBSPOT_CONFIRM_EMAIL_ID'));
  const token = Boolean(serverEnv('HUBSPOT_ACCESS_TOKEN'));

  const missing: string[] = [];
  if (!serverEnv('HUBSPOT_PORTAL_ID')) missing.push('HUBSPOT_PORTAL_ID');
  if (!serverEnv('HUBSPOT_FORM_GUID')) missing.push('HUBSPOT_FORM_GUID');
  // A transactional template without a token cannot send, so name the token only
  // when something actually needs it.
  if ((notify || confirm) && !token) missing.push('HUBSPOT_ACCESS_TOKEN');

  return { form, notify, confirm, token, usable: form || (notify && token), missing };
}

/** Reads one cookie out of a request's Cookie header. */
export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    const value = part.slice(eq + 1).trim();
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      // A malformed escape is a broken cookie, not a reason to fail the request.
      return undefined;
    }
  }
  return undefined;
}
