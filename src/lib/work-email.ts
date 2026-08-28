/**
 * Work-email gate for the contact form.
 *
 * Ported from VL3 `src/utils/forms/blocked-email-domains.ts`. The field is
 * labelled "Work email"; personal inboxes and disposable hosts are not company
 * addresses, and they are the cheapest way to pump the unauthenticated POST.
 * Matching is local: lowercase the domain after `@`, then walk parent labels so
 * `foo.gmail.com` is blocked and `notgmail.com` is not. No third-party lookup.
 *
 * The domain list is exported as an array so the inline form script can reuse
 * the same set without importing this module (Astro `is:inline` cannot).
 */

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'ymail.com',
  'rocketmail.com',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'aim.com',
  'wp.pl',
  'poczta.wp.pl',
  'vp.pl',
  'onet.pl',
  'onet.eu',
  'onet.com.pl',
  'op.pl',
  'poczta.onet.pl',
  'interia.pl',
  'interia.eu',
  'int.pl',
  'poczta.interia.pl',
  'o2.pl',
  'gazeta.pl',
  'tlen.pl',
  'poczta.fm',
  'autograf.pl',
  'go2.pl',
  'spoko.pl',
  'orange.pl',
] as const;

const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'maildrop.cc',
  'getnada.com',
  'mailnesia.com',
  'throwaway.email',
  'fakeinbox.com',
  'discard.email',
  'tempail.com',
  'tempr.email',
  'inboxkitten.com',
  'moakt.com',
  'emailondeck.com',
] as const;

export const BLOCKED_EMAIL_DOMAINS: readonly string[] = [
  ...PERSONAL_EMAIL_DOMAINS,
  ...DISPOSABLE_EMAIL_DOMAINS,
];

const BLOCKED = new Set<string>(BLOCKED_EMAIL_DOMAINS);

export function isBlockedEmail(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at === -1 || at === email.length - 1) return false;
  let current = email.slice(at + 1).trim().toLowerCase();
  while (current) {
    if (BLOCKED.has(current)) return true;
    const dot = current.indexOf('.');
    if (dot === -1) return false;
    current = current.slice(dot + 1);
  }
  return false;
}
