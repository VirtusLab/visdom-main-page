/**
 * Unit tests for Turnstile siteverify. `node --test` runs them directly; the
 * only seam is the injected fetch, matching src/lib/hubspot.test.ts.
 */
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { turnstileConfigured, verifyTurnstile } from './turnstile.ts';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const ENV_KEYS = ['TURNSTILE_SECRET_KEY'];
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of ENV_KEYS) saved[k] = process.env[k];
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

interface Call {
  url: string;
  method: string;
  body: Record<string, string>;
}

function stubFetch(responses: Array<{ status: number; body?: unknown; raw?: string }>) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit = {}) => {
    const next = responses[Math.min(calls.length, responses.length - 1)];
    const rawBody = init.body;
    const body =
      rawBody instanceof URLSearchParams
        ? Object.fromEntries(rawBody)
        : typeof rawBody === 'string'
          ? Object.fromEntries(new URLSearchParams(rawBody))
          : {};
    calls.push({ url: String(url), method: init.method ?? 'GET', body });
    if (next.raw !== undefined) {
      return new Response(next.raw, { status: next.status });
    }
    return new Response(next.body === undefined ? '' : JSON.stringify(next.body), {
      status: next.status,
    });
  }) as unknown as typeof fetch;
  return { calls, impl };
}

function fetchMustNotRun(): typeof fetch {
  return (async () => {
    throw new Error('siteverify must not be called');
  }) as unknown as typeof fetch;
}

test('a valid token is accepted and the secret is posted to siteverify', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret-test';
  const { calls, impl } = stubFetch([{ status: 200, body: { success: true } }]);
  const result = await verifyTurnstile({ token: 'tok-123', ip: '203.0.113.4' }, { fetchImpl: impl });
  assert.deepEqual(result, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, SITEVERIFY);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].body.secret, 'secret-test');
  assert.equal(calls[0].body.response, 'tok-123');
  assert.equal(calls[0].body.remoteip, '203.0.113.4');
});

test('a rejected token fails closed', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret-test';
  const { impl } = stubFetch([{ status: 200, body: { success: false, 'error-codes': ['invalid-input-response'] } }]);
  const result = await verifyTurnstile({ token: 'bad' }, { fetchImpl: impl });
  assert.deepEqual(result, { ok: false });
});

test('an empty token fails without calling siteverify', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret-test';
  const result = await verifyTurnstile({ token: '   ' }, { fetchImpl: fetchMustNotRun() });
  assert.deepEqual(result, { ok: false });
});

test('a missing secret skips verification so local builds still work', async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  const result = await verifyTurnstile({ token: '' }, { fetchImpl: fetchMustNotRun() });
  assert.deepEqual(result, { ok: true, skipped: true });
  assert.equal(turnstileConfigured(), false);
});

test('an unknown IP is not sent to siteverify', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret-test';
  const { calls, impl } = stubFetch([{ status: 200, body: { success: true } }]);
  await verifyTurnstile({ token: 'tok', ip: 'unknown' }, { fetchImpl: impl });
  assert.equal(calls[0].body.remoteip, undefined);
});

test('a non-JSON or unreachable siteverify fails closed', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret-test';
  const { impl } = stubFetch([{ status: 200, raw: 'not-json' }]);
  const result = await verifyTurnstile({ token: 'tok' }, { fetchImpl: impl });
  assert.deepEqual(result, { ok: false });
});

test('turnstileConfigured is true only when the secret is present', () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  assert.equal(turnstileConfigured(), false);
  process.env.TURNSTILE_SECRET_KEY = 'secret-test';
  assert.equal(turnstileConfigured(), true);
});
