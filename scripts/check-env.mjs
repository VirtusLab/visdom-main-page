/**
 * Build guard: refuse to ship a production build whose contact form has nowhere
 * to put a lead.
 *
 * Why this exists. The form posted to /api/contact for three days while the
 * credential it needed was not set on the project. Every visitor who submitted
 * got an error, and nobody noticed, because a misconfigured deployment builds and
 * serves exactly like a working one. The only signal was a log line no one was
 * reading. This turns that into a failed build, which somebody does notice.
 *
 * Scope is deliberately narrow:
 * - It fails ONLY for a production build. A preview or a local build has no
 *   business being blocked by marketing configuration, and contributors without
 *   HubSpot access must still be able to run `npm run build`.
 * - It checks presence, never validity. A wrong-but-present form id is a mistake
 *   this cannot see; the smoke check against a running deployment can.
 * - VISDOM_ALLOW_UNCONFIGURED=1 overrides it, so a genuine emergency deploy is
 *   never blocked by this file. Using it prints a warning rather than staying
 *   quiet, so the override leaves a trace in the build log.
 */

const isProd = process.env.VERCEL_ENV === 'production';
const override = process.env.VISDOM_ALLOW_UNCONFIGURED === '1';

const present = (name) => Boolean(process.env[name]);

const form = present('HUBSPOT_PORTAL_ID') && present('HUBSPOT_FORM_GUID');
const notify = present('HUBSPOT_NOTIFY_EMAIL_ID');
const token = present('HUBSPOT_ACCESS_TOKEN');
// Either channel is enough: the CRM write, or a transactional notification that
// can actually be sent. See src/lib/hubspot.ts for why they are independent.
const usable = form || (notify && token);

const missing = [];
if (!present('HUBSPOT_PORTAL_ID')) missing.push('HUBSPOT_PORTAL_ID');
if (!present('HUBSPOT_FORM_GUID')) missing.push('HUBSPOT_FORM_GUID');

const state = `form=${form} notify=${notify} token=${token}`;

if (usable) {
  console.log(`[check-env] contact form is configured (${state})`);
  process.exit(0);
}

if (!isProd) {
  console.warn(
    `[check-env] contact form is NOT configured (${state}). ` +
      'Fine for a local or preview build: submissions answer 502 and the page ' +
      'falls back to the mailto link. Set the variables from .env.example to test it.',
  );
  process.exit(0);
}

if (override) {
  console.warn(
    `[check-env] contact form is NOT configured (${state}), but ` +
      'VISDOM_ALLOW_UNCONFIGURED=1 was set, so the build continues. ' +
      'Every lead submitted against this deployment will be lost.',
  );
  process.exit(0);
}

console.error(
  [
    '',
    '  Production build refused: the contact form has nowhere to put a lead.',
    '',
    `  Missing: ${missing.join(', ')}`,
    '',
    '  Set them in Vercel under Project Settings, Environment Variables, then',
    '  push a commit. Vercel captures env vars when a deployment is built, so an',
    '  already-running deployment keeps the old values and `vercel redeploy` is',
    '  not the way to apply them.',
    '',
    '  Shipping anyway (only if a broken form is genuinely acceptable right now):',
    '  set VISDOM_ALLOW_UNCONFIGURED=1.',
    '',
  ].join('\n'),
);
process.exit(1);
