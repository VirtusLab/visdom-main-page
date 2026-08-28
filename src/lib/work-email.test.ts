/**
 * The contact form asks for a work email. These cases pin the matcher so a
 * company domain is not rejected, and a personal or disposable one cannot slip
 * through by changing case or nesting a subdomain.
 *
 * Cases match VL3 `blocked-email-domains.test.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBlockedEmail } from './work-email.ts';

test('a VirtusLab address is a work email', () => {
  assert.equal(isBlockedEmail('name@virtuslab.com'), false);
});

test('example.com is allowed, which is what smoke uses', () => {
  assert.equal(isBlockedEmail('user@example.com'), false);
});

test('a lookalike that is not the blocked domain is allowed', () => {
  assert.equal(isBlockedEmail('a@notgmail.com'), false);
});

test('gmail is blocked', () => {
  assert.equal(isBlockedEmail('user@gmail.com'), true);
});

test('gmail is blocked regardless of case', () => {
  assert.equal(isBlockedEmail('User@GMAIL.COM'), true);
});

test('Polish free-mail is blocked regardless of case', () => {
  assert.equal(isBlockedEmail('User@WP.PL'), true);
  assert.equal(isBlockedEmail('a@onet.pl'), true);
});

test('a disposable host is blocked', () => {
  assert.equal(isBlockedEmail('a@mailinator.com'), true);
});

test('a subdomain of a blocked host is still blocked', () => {
  assert.equal(isBlockedEmail('a@foo.gmail.com'), true);
});

test('missing or trailing @ is not treated as blocked', () => {
  assert.equal(isBlockedEmail('not-an-email'), false);
  assert.equal(isBlockedEmail('user@'), false);
});
