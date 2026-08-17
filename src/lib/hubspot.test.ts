/**
 * Unit tests for the HubSpot client. `node --test` runs them directly, so there is
 * no test framework to install: Node strips the types and the only seam the tests
 * need is the injected fetch.
 *
 * What is worth testing here is exactly what a live portal will not tell us
 * quickly: that a refusal hidden inside a 200 fails, that a retry cannot send the
 * same mail twice, and that a half-configured form still captures the lead.
 */
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  HubSpotError,
  configSummary,
  readCookie,
  sendTransactionalEmail,
  submitLead,
  transactionalEmailId,
} from './hubspot.ts';

interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
}

/** A fetch stub that records calls and replays queued responses. */
function stubFetch(responses: Array<{ status: number; body?: unknown; headers?: Record<string, string> }>) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit = {}) => {
    const next = responses[Math.min(calls.length, responses.length - 1)];
    calls.push({
      url: String(url),
      method: init.method ?? 'GET',
      headers: (init.headers ?? {}) as Record<string, string>,
      body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
    });
    return new Response(next.body === undefined ? '' : JSON.stringify(next.body), {
      status: next.status,
      headers: next.headers,
    });
  }) as unknown as typeof fetch;
  return { calls, impl };
}

const deps = (impl: typeof fetch) => ({ fetchImpl: impl, sleep: async () => {} });

const ENV_KEYS = [
  'HUBSPOT_ACCESS_TOKEN',
  'HUBSPOT_PORTAL_ID',
  'HUBSPOT_FORM_GUID',
  'HUBSPOT_SUBSCRIPTION_TYPE_ID',
  'HUBSPOT_NOTIFY_EMAIL_ID',
  'HUBSPOT_CONFIRM_EMAIL_ID',
];
const saved: Record<string, string | undefined> = {};
let restoreConsole: (() => void) | undefined;

beforeEach(() => {
  for (const k of ENV_KEYS) saved[k] = process.env[k];
  // The module logs every failure by design, which would bury the test output.
  const { log, warn, error } = console;
  restoreConsole = () => Object.assign(console, { log, warn, error });
  Object.assign(console, { log() {}, warn() {}, error() {} });
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  restoreConsole?.();
});

// ── Transactional email ──────────────────────────────────────────────────────

test('sends a transactional email and reports the accepted result', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { calls, impl } = stubFetch([{ status: 200, body: { status: 'COMPLETE', sendResult: 'SENT' } }]);

  await sendTransactionalEmail(
    {
      to: 'lead@example.com',
      emailId: 42,
      replyTo: 'someone@example.com',
      sendId: 'sub-1-notify-0',
      customProperties: { summary: 'hello' },
    },
    deps(impl),
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.hubapi.com/marketing/v3/transactional/single-email/send');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].headers.Authorization, 'Bearer pat-test-123');
  assert.equal(calls[0].body.emailId, 42);
  assert.equal(calls[0].body.message.to, 'lead@example.com');
  // replyTo is an array in the API even for one address.
  assert.deepEqual(calls[0].body.message.replyTo, ['someone@example.com']);
  assert.equal(calls[0].body.message.sendId, 'sub-1-notify-0');
  assert.equal(calls[0].body.customProperties.summary, 'hello');
});

test('a refusal inside a 200 throws rather than reporting delivery', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { impl } = stubFetch([{ status: 200, body: { status: 'COMPLETE', sendResult: 'PREVIOUSLY_BOUNCED' } }]);

  await assert.rejects(
    () => sendTransactionalEmail({ to: 'bounced@example.com', emailId: 1 }, deps(impl)),
    (e: unknown) => e instanceof HubSpotError && e.code === 'HUBSPOT_REJECTED',
  );
});

test('a deduplicated resend counts as sent', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { impl } = stubFetch([{ status: 200, body: { status: 'COMPLETE', sendResult: 'IDEMPOTENT_IGNORE' } }]);

  await sendTransactionalEmail({ to: 'lead@example.com', emailId: 1, sendId: 'same' }, deps(impl));
});

test('an unresolved send is chased through the status endpoint', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { calls, impl } = stubFetch([
    { status: 200, body: { status: 'PENDING', statusId: 'st-9' } },
    { status: 200, body: { status: 'COMPLETE', sendResult: 'BLOCKED_DOMAIN' } },
  ]);

  await assert.rejects(
    () => sendTransactionalEmail({ to: 'lead@blocked.test', emailId: 1 }, deps(impl)),
    (e: unknown) => e instanceof HubSpotError && e.code === 'HUBSPOT_REJECTED',
  );
  assert.equal(calls[1].url, 'https://api.hubapi.com/marketing/v3/email/send-statuses/st-9');
  assert.equal(calls[1].method, 'GET');
});

test('a still-pending send is accepted, because HubSpot owns the queue', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { impl } = stubFetch([{ status: 200, body: { status: 'PENDING' } }]);

  await sendTransactionalEmail({ to: 'lead@example.com', emailId: 1 }, deps(impl));
});

test('a 429 is retried, and the second answer stands', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { calls, impl } = stubFetch([
    { status: 429, headers: { 'retry-after': '1' } },
    { status: 200, body: { status: 'COMPLETE', sendResult: 'SENT' } },
  ]);

  await sendTransactionalEmail({ to: 'lead@example.com', emailId: 1 }, deps(impl));
  assert.equal(calls.length, 2);
});

test('a 4xx is not retried', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  const { calls, impl } = stubFetch([{ status: 404, body: { message: 'no such email' } }]);

  await assert.rejects(
    () => sendTransactionalEmail({ to: 'lead@example.com', emailId: 999 }, deps(impl)),
    (e: unknown) => e instanceof HubSpotError && e.code === 'HUBSPOT_HTTP_ERROR',
  );
  assert.equal(calls.length, 1);
});

test('no token is a configuration error, not a send', async () => {
  delete process.env.HUBSPOT_ACCESS_TOKEN;
  const { calls, impl } = stubFetch([{ status: 200, body: { status: 'COMPLETE', sendResult: 'SENT' } }]);

  await assert.rejects(
    () => sendTransactionalEmail({ to: 'lead@example.com', emailId: 1 }, deps(impl)),
    (e: unknown) => e instanceof HubSpotError && e.code === 'HUBSPOT_CONFIG_MISSING',
  );
  assert.equal(calls.length, 0);
});

test('a non-numeric template id is ignored rather than sent to HubSpot', () => {
  process.env.HUBSPOT_NOTIFY_EMAIL_ID = 'not-a-number';
  assert.equal(transactionalEmailId('HUBSPOT_NOTIFY_EMAIL_ID'), undefined);
  process.env.HUBSPOT_NOTIFY_EMAIL_ID = '77';
  assert.equal(transactionalEmailId('HUBSPOT_NOTIFY_EMAIL_ID'), 77);
});

// ── Lead capture ─────────────────────────────────────────────────────────────

test('submits the lead to the authenticated endpoint and splits the name', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  process.env.HUBSPOT_PORTAL_ID = '1234567';
  process.env.HUBSPOT_FORM_GUID = 'form-guid';
  delete process.env.HUBSPOT_SUBSCRIPTION_TYPE_ID;
  const { calls, impl } = stubFetch([{ status: 200, body: { inlineMessage: 'Thanks' } }]);

  const result = await submitLead(
    {
      email: 'lead@example.com',
      name: 'Ada Lovelace King',
      company: 'Analytical Engines',
      message: 'We ship weekly.',
      locale: 'pl',
      pageUri: 'https://visdom.virtuslab.com/pl/',
      ipAddress: '203.0.113.7',
      hutk: 'utk-abc',
    },
    deps(impl),
  );

  assert.deepEqual(result.droppedFields, []);
  assert.equal(
    calls[0].url,
    'https://api.hsforms.com/submissions/v3/integration/secure/submit/1234567/form-guid',
  );
  assert.equal(calls[0].headers.Authorization, 'Bearer pat-test-123');
  const byName = Object.fromEntries(calls[0].body.fields.map((f: any) => [f.name, f.value]));
  assert.equal(byName.email, 'lead@example.com');
  assert.equal(byName.firstname, 'Ada');
  assert.equal(byName.lastname, 'Lovelace King');
  assert.equal(byName.company, 'Analytical Engines');
  assert.equal(byName.hs_language, 'pl');
  assert.equal(calls[0].body.fields[0].objectTypeId, '0-1');
  assert.equal(calls[0].body.context.hutk, 'utk-abc');
  assert.equal(calls[0].body.context.ipAddress, '203.0.113.7');
  assert.equal(calls[0].body.legalConsentOptions, undefined);
});

test('an unusable IP and an odd locale are left out instead of failing the submission', async () => {
  process.env.HUBSPOT_PORTAL_ID = '1234567';
  process.env.HUBSPOT_FORM_GUID = 'form-guid';
  delete process.env.HUBSPOT_ACCESS_TOKEN;
  const { calls, impl } = stubFetch([{ status: 200, body: {} }]);

  await submitLead({ email: 'lead@example.com', ipAddress: 'unknown', locale: 'klingon' }, deps(impl));

  // No token, so the public endpoint, which is what a browser would have used.
  assert.equal(
    calls[0].url,
    'https://api.hsforms.com/submissions/v3/integration/submit/1234567/form-guid',
  );
  assert.equal(calls[0].headers.Authorization, undefined);
  assert.equal(calls[0].body.context, undefined);
  assert.equal(calls[0].body.fields.some((f: any) => f.name === 'hs_language'), false);
});

test('a token without the forms scope falls back to the public endpoint', async () => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  process.env.HUBSPOT_PORTAL_ID = '1234567';
  process.env.HUBSPOT_FORM_GUID = 'form-guid';
  const { calls, impl } = stubFetch([
    { status: 403, body: { message: 'missing scopes' } },
    { status: 200, body: {} },
  ]);

  await submitLead({ email: 'lead@example.com' }, deps(impl));

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/secure\/submit\//);
  assert.doesNotMatch(calls[1].url, /\/secure\/submit\//);
  assert.equal(calls[1].headers.Authorization, undefined);
});

test('a form missing an optional field still captures the lead', async () => {
  process.env.HUBSPOT_PORTAL_ID = '1234567';
  process.env.HUBSPOT_FORM_GUID = 'form-guid';
  delete process.env.HUBSPOT_ACCESS_TOKEN;
  const { calls, impl } = stubFetch([
    {
      status: 400,
      body: { errors: [{ message: 'Error in \'fields.3\'. The field "message" does not exist.', errorType: 'INVALID_FORM_FIELD' }] },
    },
    { status: 200, body: {} },
  ]);

  const result = await submitLead(
    { email: 'lead@example.com', name: 'Ada', message: 'We ship weekly.' },
    deps(impl),
  );

  assert.deepEqual(result.droppedFields, ['message']);
  assert.equal(calls[1].body.fields.some((f: any) => f.name === 'message'), false);
  assert.equal(calls[1].body.fields.some((f: any) => f.name === 'email'), true);
});

test('a 400 that is not about a field is not retried', async () => {
  process.env.HUBSPOT_PORTAL_ID = '1234567';
  process.env.HUBSPOT_FORM_GUID = 'form-guid';
  delete process.env.HUBSPOT_ACCESS_TOKEN;
  const { calls, impl } = stubFetch([
    { status: 400, body: { errors: [{ message: 'Email address is invalid', errorType: 'INVALID_EMAIL' }] } },
  ]);

  await assert.rejects(
    () => submitLead({ email: 'nope' }, deps(impl)),
    (e: unknown) => e instanceof HubSpotError && e.code === 'HUBSPOT_HTTP_ERROR',
  );
  assert.equal(calls.length, 1);
});

test('consent is sent only when a subscription type is configured', async () => {
  process.env.HUBSPOT_PORTAL_ID = '1234567';
  process.env.HUBSPOT_FORM_GUID = 'form-guid';
  process.env.HUBSPOT_SUBSCRIPTION_TYPE_ID = '999';
  delete process.env.HUBSPOT_ACCESS_TOKEN;
  const { calls, impl } = stubFetch([{ status: 200, body: {} }]);

  await submitLead({ email: 'lead@example.com' }, deps(impl));

  assert.equal(calls[0].body.legalConsentOptions.legitimateInterest.value, true);
  assert.equal(calls[0].body.legalConsentOptions.legitimateInterest.subscriptionTypeId, 999);
  assert.equal(calls[0].body.legalConsentOptions.legitimateInterest.legalBasis, 'LEAD');
});

test('an unconfigured portal is a configuration error, not a submission', async () => {
  delete process.env.HUBSPOT_PORTAL_ID;
  delete process.env.HUBSPOT_FORM_GUID;
  const { calls, impl } = stubFetch([{ status: 200, body: {} }]);

  await assert.rejects(
    () => submitLead({ email: 'lead@example.com' }, deps(impl)),
    (e: unknown) => e instanceof HubSpotError && e.code === 'HUBSPOT_CONFIG_MISSING',
  );
  assert.equal(calls.length, 0);
});

// ── Configuration reporting ──────────────────────────────────────────────────
//
// This is what the health check and the build guard both read, so a wrong answer
// here is exactly the silent failure they exist to prevent.

const clearHubSpotEnv = () => ENV_KEYS.forEach((k) => delete process.env[k]);

test('an unconfigured instance reports itself unusable and names what is missing', () => {
  clearHubSpotEnv();
  const cfg = configSummary();
  assert.equal(cfg.usable, false);
  assert.equal(cfg.form, false);
  assert.deepEqual(cfg.missing, ['HUBSPOT_PORTAL_ID', 'HUBSPOT_FORM_GUID']);
});

test('the form channel alone makes an instance usable', () => {
  clearHubSpotEnv();
  process.env.HUBSPOT_PORTAL_ID = '2404976';
  process.env.HUBSPOT_FORM_GUID = 'guid';
  const cfg = configSummary();
  assert.equal(cfg.usable, true);
  assert.equal(cfg.form, true);
  assert.deepEqual(cfg.missing, []);
});

test('half a form is not a form', () => {
  clearHubSpotEnv();
  process.env.HUBSPOT_PORTAL_ID = '2404976';
  const cfg = configSummary();
  assert.equal(cfg.form, false);
  assert.equal(cfg.usable, false);
  assert.deepEqual(cfg.missing, ['HUBSPOT_FORM_GUID']);
});

test('a transactional template without a token cannot send, and says so', () => {
  clearHubSpotEnv();
  process.env.HUBSPOT_NOTIFY_EMAIL_ID = '123';
  const cfg = configSummary();
  assert.equal(cfg.notify, true);
  assert.equal(cfg.token, false);
  // No form and no token, so nothing can accept a lead.
  assert.equal(cfg.usable, false);
  assert.ok(cfg.missing.includes('HUBSPOT_ACCESS_TOKEN'));
});

test('transactional alone is enough when it can actually send', () => {
  clearHubSpotEnv();
  process.env.HUBSPOT_NOTIFY_EMAIL_ID = '123';
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-test-123';
  assert.equal(configSummary().usable, true);
});

test('the summary carries no values, only booleans and variable names', () => {
  clearHubSpotEnv();
  process.env.HUBSPOT_PORTAL_ID = '2404976';
  process.env.HUBSPOT_FORM_GUID = 'super-secret-guid';
  process.env.HUBSPOT_ACCESS_TOKEN = 'pat-super-secret';
  const serialised = JSON.stringify(configSummary());
  // The health endpoint publishes this, so a leak here is a public leak.
  assert.doesNotMatch(serialised, /super-secret-guid|pat-super-secret|2404976/);
});

// ── Helpers ──────────────────────────────────────────────────────────────────

test('reads the tracking cookie out of a cookie header', () => {
  assert.equal(readCookie('a=1; hubspotutk=abc123; b=2', 'hubspotutk'), 'abc123');
  assert.equal(readCookie('a=1', 'hubspotutk'), undefined);
  assert.equal(readCookie(null, 'hubspotutk'), undefined);
  // A broken escape is a broken cookie, and must not throw out of the endpoint.
  assert.equal(readCookie('hubspotutk=%zz', 'hubspotutk'), undefined);
});
