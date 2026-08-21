/**
 * Post-deploy smoke check for the contact endpoint.
 *
 *   npm run smoke                       # production
 *   npm run smoke -- https://host       # a preview deployment
 *
 * Answers the one question that a green build does not: is the deployment that
 * is serving traffic right now able to accept a lead? It asks the running
 * instance rather than the project settings, so it catches an env var that was
 * changed but never redeployed.
 *
 * Deliberately free of side effects, so it is safe to run against production as
 * often as you like:
 * - GET reports configuration and nothing else.
 * - The honeypot POST returns before Turnstile or HubSpot. No contact is created.
 * - When captcha is configured, a tokenless POST is refused with 4xx and never
 *   reaches HubSpot.
 *
 * It does NOT prove a lead reaches the right HubSpot form. Nothing reachable from
 * outside can: a submission to the wrong form succeeds just as loudly as one to
 * the right form. That check is a real submission plus a look at the CRM.
 */

const base = (process.argv[2] || 'https://visdom.virtuslab.com').replace(/\/$/, '');
const endpoint = `${base}/api/contact`;
const TIMEOUT_MS = 20_000;

const failures = [];
const note = (ok, message) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${message}`);
  if (!ok) failures.push(message);
};

async function call(init) {
  const res = await fetch(endpoint, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const text = await res.text().catch(() => '');
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = undefined;
  }
  return { status: res.status, body, text };
}

console.log(`\nSmoke check: ${endpoint}\n`);

try {
  const health = await call({ method: 'GET' });
  note(health.status === 200, `health responds 200 (got ${health.status})`);
  note(health.body?.ok === true, 'at least one channel can accept a lead');
  note(health.body?.configured?.form === true, 'CRM form submission is configured');
  note(health.body?.configured?.captcha === true, 'Turnstile is configured');
  if (health.body?.missing?.length) {
    note(false, `missing variables: ${health.body.missing.join(', ')}`);
  }

  // Honeypot filled, so the handler answers and stops before Turnstile or HubSpot.
  // `skipped` proves the request reached our code rather than a cached page.
  const nooped = await call({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'smoke check',
      email: 'smoke@example.com',
      website: 'honeypot',
      locale: 'en',
    }),
  });
  note(nooped.status === 200, `honeypot submission responds 200 (got ${nooped.status})`);
  note(nooped.body?.skipped === true, 'honeypot path short-circuits, nothing was sent');

  // A real-looking post without a token must not reach HubSpot. Only asserted
  // when captcha is configured: a local or preview host without keys skips
  // Turnstile on purpose, and a 200 here would be a lead.
  if (health.body?.configured?.captcha) {
    const denied = await call({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'smoke check',
        email: 'smoke@example.com',
        locale: 'en',
      }),
    });
    note(
      denied.status >= 400 && denied.status < 500,
      `a submission without a Turnstile token is refused (got ${denied.status})`,
    );
    note(denied.body?.captcha === true, 'refusal is tagged as a captcha failure');
  }

  // Any 4xx counts. Our handler answers 405, but Astro's own CSRF guard rejects
  // some methods with 403 before the handler runs, and which one you get is not
  // the point. The point is that the route refuses instead of quietly accepting,
  // which is what a static file or a stray rewrite in its place would do.
  const method = await call({ method: 'PUT' });
  note(
    method.status >= 400 && method.status < 500,
    `an unsupported method is refused (got ${method.status})`,
  );
} catch (e) {
  note(false, `could not reach the endpoint: ${e instanceof Error ? e.message : String(e)}`);
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed. The contact form is not healthy.\n`);
  process.exit(1);
}
console.log('\nAll checks passed.\n');
