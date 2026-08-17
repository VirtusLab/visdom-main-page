/**
 * Attribution is another quiet failure: a lead credited to the wrong property is
 * still a lead, so nothing downstream complains and the numbers are simply wrong.
 * Every branch of the resolution order is pinned here.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allowedOrigin, pageUriOf, resolveSource } from './source.ts';

const ctx = (o: Partial<{ origin: string; referer: string; url: string }> = {}) => ({
  origin: o.origin ?? null,
  referer: o.referer ?? null,
  url: o.url ?? 'https://visdom.virtuslab.com/api/contact',
});

// ── Declared source wins ─────────────────────────────────────────────────────

test('a page that names itself is believed, and gets the canonical label', () => {
  const s = resolveSource(ctx(), 'maturity-matrix');
  assert.equal(s.slug, 'maturity-matrix');
  assert.equal(s.label, 'Visdom Maturity Matrix');
  assert.equal(s.declared, true);
});

test('a declared source beats the hostname it was posted from', () => {
  // The Matrix posting to this endpoint: the URL is ours, the source is theirs.
  const s = resolveSource(ctx({ url: 'https://visdom.virtuslab.com/api/contact' }), 'maturity-matrix');
  assert.equal(s.slug, 'maturity-matrix');
});

test('an unknown but well-formed slug is still recorded', () => {
  // So a new property reports itself correctly before this table knows about it.
  const s = resolveSource(ctx(), 'webinar-lp');
  assert.equal(s.slug, 'webinar-lp');
  assert.equal(s.declared, true);
});

// ── Falling back to headers ──────────────────────────────────────────────────

test('Origin classifies a cross-origin post that forgot to declare itself', () => {
  const s = resolveSource(ctx({ origin: 'https://visdom-maturity-matrix.virtuslab.com' }));
  assert.equal(s.slug, 'maturity-matrix');
  assert.equal(s.declared, false);
});

test('Referer is used when there is no Origin', () => {
  const s = resolveSource(ctx({ referer: 'https://visdom-maturity-matrix.virtuslab.com/workshop' }));
  assert.equal(s.slug, 'maturity-matrix');
});

test('Origin outranks Referer', () => {
  const s = resolveSource(
    ctx({
      origin: 'https://visdom-maturity-matrix.virtuslab.com',
      referer: 'https://visdom.virtuslab.com/',
    }),
  );
  assert.equal(s.slug, 'maturity-matrix');
});

test('the serving host is the last resort, which is right when both ship together', () => {
  assert.equal(resolveSource(ctx()).slug, 'visdom-site');
});

test('an unrecognised host is labelled unknown rather than guessed', () => {
  const s = resolveSource(ctx({ url: 'https://somewhere-else.example/api/contact' }));
  assert.equal(s.slug, 'unknown');
  assert.equal(s.declared, false);
});

// ── Rejecting junk ───────────────────────────────────────────────────────────

test('a malformed slug is discarded, not sanitised, and the host decides', () => {
  for (const junk of [
    'Maturity Matrix',
    '<script>alert(1)</script>',
    'matrix\nInjected: header',
    '../../etc/passwd',
    'UPPERCASE',
    '-leading-hyphen',
    'x'.repeat(41),
  ]) {
    const s = resolveSource(ctx(), junk);
    assert.equal(s.slug, 'visdom-site', `should have rejected ${JSON.stringify(junk)}`);
    assert.equal(s.declared, false);
  }
});

test('an empty or missing source is simply derived', () => {
  assert.equal(resolveSource(ctx(), '').declared, false);
  assert.equal(resolveSource(ctx(), '   ').declared, false);
  assert.equal(resolveSource(ctx()).declared, false);
});

test('a garbage Origin header does not throw', () => {
  assert.equal(resolveSource(ctx({ origin: 'not a url' })).slug, 'visdom-site');
});

// ── Page URI ─────────────────────────────────────────────────────────────────

test('the page URI comes from the referer when it is a real web URL', () => {
  const uri = pageUriOf(ctx({ referer: 'https://visdom-maturity-matrix.virtuslab.com/workshop' }));
  assert.equal(uri, 'https://visdom-maturity-matrix.virtuslab.com/workshop');
});

test('a non-web referer falls back to the endpoint URL', () => {
  for (const bad of ['javascript:alert(1)', 'not a url', '']) {
    assert.equal(pageUriOf(ctx({ referer: bad })), 'https://visdom.virtuslab.com/api/contact');
  }
});

test('the page URI is capped, since it lands in an email and a CRM record', () => {
  const long = `https://example.com/${'a'.repeat(900)}`;
  assert.equal(pageUriOf(ctx({ referer: long })).length, 500);
});

// ── CORS allow-list ──────────────────────────────────────────────────────────

test('no cross-origin caller is allowed until one is configured', () => {
  assert.equal(allowedOrigin('https://visdom-maturity-matrix.virtuslab.com', undefined), undefined);
  assert.equal(allowedOrigin('https://visdom-maturity-matrix.virtuslab.com', ''), undefined);
});

test('a configured origin is allowed, and a trailing slash does not matter', () => {
  const list = 'https://visdom-maturity-matrix.virtuslab.com/, https://other.example';
  assert.equal(
    allowedOrigin('https://visdom-maturity-matrix.virtuslab.com', list),
    'https://visdom-maturity-matrix.virtuslab.com',
  );
});

test('an origin that is not on the list is refused', () => {
  const list = 'https://visdom-maturity-matrix.virtuslab.com';
  assert.equal(allowedOrigin('https://evil.example', list), undefined);
  // No substring or suffix matching: a lookalike host must not slip through.
  assert.equal(allowedOrigin('https://evil-visdom-maturity-matrix.virtuslab.com', list), undefined);
  assert.equal(allowedOrigin('http://visdom-maturity-matrix.virtuslab.com', list), undefined);
});

test('a request with no Origin header is not given CORS headers', () => {
  assert.equal(allowedOrigin(null, 'https://visdom-maturity-matrix.virtuslab.com'), undefined);
});
