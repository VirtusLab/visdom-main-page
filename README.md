# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build the site. Static pages land in `./dist/client/`, the contact-form function in `./.vercel/output/` |
| `npm test`                | Run the unit tests (`src/**/*.test.ts`), also run by `npm run build` |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

Node 22.18 or newer is required: the tests are TypeScript and run on Node's own
test runner, which needs the type stripping that landed in that version.

## 📈 Analytics

The site supports Google Analytics 4. It only loads when a measurement ID is set:

1. Get your GA4 measurement ID (format `G-XXXXXXXXXX`) from the Google Analytics admin.
2. Set `PUBLIC_GA_ID` in the environment:
   - Local: copy `.env.example` to `.env` and fill in the value.
   - Vercel: add `PUBLIC_GA_ID` under Project Settings, Environment Variables.
3. Redeploy (or restart `npm run dev`). With no ID set, no analytics script loads.

## 📬 Contact form (HubSpot)

`POST /api/contact` sends the working-session form to HubSpot. HubSpot is both the
system of record for the lead and the sender of every email, in two channels that
are configured independently (`src/lib/hubspot.ts`):

**A. Form submission (no add-on needed, the main path)**

1. In HubSpot, create a form with the fields `email`, `firstname`, `lastname`,
   `company`, `message` and, for the page language, `hs_language` ("Preferred
   language"). A field the form does not define is dropped and the submission is
   retried, so a missing optional field costs data, not the lead.
2. Turn ON "Automatically create new contacts from unknown email addresses" in the
   form's General settings. It is OFF by default, and with it off a first-time
   visitor never becomes a contact, which silently loses the lead.
3. Do NOT enable reCAPTCHA, and ignore HubSpot's warning about it. Submissions
   arrive server-side from this endpoint rather than from a rendered form, so a
   captcha rejects every one of them. Spam is handled here instead: a honeypot
   field and per-IP rate limiting.
4. Set the form's notification recipients, and its follow-up email if the visitor
   should get a confirmation. That copy lives in HubSpot on purpose: marketing can
   change it without a deploy. Only people with a HubSpot seat can be picked as
   recipients.
5. Set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID`. The GUID stays in the
   environment rather than in this repo, so the endpoint is not handed to spammers.
6. Optional: a private app token in `HUBSPOT_ACCESS_TOKEN` with the `forms` scope
   uses the authenticated endpoint, which has higher rate limits. Without the
   scope the endpoint falls back to the public one automatically.

Changing either variable needs a redeploy, and the way to trigger one is to push a
commit. Vercel captures environment variables when a deployment is built, so an
already-running deployment keeps the old values. (`vercel redeploy` currently
fails on this project: it builds without the cache and then cannot authenticate to
GitHub Packages for `@virtuslab/visdom-ui`.)

### Putting this form on another property

The same HubSpot form is shared, on purpose: duplicating it would split the
submission history and double the settings that can silently drift apart. Nothing
in HubSpot needs changing to add a property, because the origin travels as
submission *context* (`pageUri`, `pageName`) rather than as a form field.

Each lead is attributed in three places: the page name and page URL on the HubSpot
submission, a `Source:` line in the transactional notification, and `source=` in
the server log.

To add a property (`src/lib/source.ts`):

1. Add its hostname to `SOURCES` with a slug and a human label.
2. Have its form send `source` with that slug, both in the JSON payload and as a
   hidden input for the no-JS path. See `SOURCE` in `src/components/CtaSection.astro`.
3. Decide how it reaches the endpoint:
   - **Ship a copy of the endpoint** on that property, which is what the Maturity
     Matrix already does for its own email. Nothing else to configure.
   - **Or post to this endpoint cross-origin**, which additionally needs the
     property's origin in `CONTACT_ALLOWED_ORIGINS` here. It is an explicit
     allow-list, never a wildcard: this endpoint is unauthenticated and writes to
     the CRM.

Step 1 is a convenience, not a requirement. A property that declares a slug this
repo has never heard of is still recorded under that slug, and a property that
declares nothing is classified by `Origin`, then `Referer`, then the serving host.
A caller-supplied slug is trusted for labelling only: it can never change where the
lead goes, who is notified, or whether the CRM write happens, and anything outside
`[a-z0-9-]` is discarded rather than sanitised.

### Guards against losing a lead quietly

A misconfigured deployment builds and serves exactly like a working one, which is
how this form spent three days answering every visitor with an error before anyone
noticed. Three things now make that loud:

- **`npm run check:env`**, part of `npm run build`. A *production* build fails if
  no channel can accept a lead, and names the missing variables. Local and preview
  builds only warn, so a contributor without HubSpot access can still build.
  `VISDOM_ALLOW_UNCONFIGURED=1` overrides it and says so in the log.
- **`GET /api/contact`**, a health check reporting booleans only, never values. It
  answers 503 when nothing can accept a lead, so an uptime monitor pointed at it
  treats a silently broken form as the outage it is. This is what catches a
  variable that was changed but never redeployed, which the build guard cannot
  see.
- **`npm run smoke`** (optionally `npm run smoke -- https://preview-url`) asks a
  running deployment the same question and exits non-zero if it is unhealthy. It
  has no side effects: the health check is a read, and its submission fills the
  honeypot, so the handler returns before contacting HubSpot or sending anything.
  Safe to run against production as often as you like.

None of these prove a lead reaches the *right* HubSpot form. Nothing observable
from outside can, because a submission to the wrong form succeeds just as loudly
as one to the right form. That check is a real submission plus a look at the CRM.
Two settings on the HubSpot side deserve the same suspicion, since both fail
silently with a 200: contact creation being off, and reCAPTCHA being on.

**B. Transactional Single-Send emails (needs the transactional email add-on)**

1. Connect the sending domain in HubSpot and create the templates in the email
   tool as transactional emails.
2. The team notification template receives `{{ custom.summary }}` (the whole
   request as text) plus `lead_name`, `lead_email`, `lead_company`,
   `lead_message`, `locale`, `page_uri` and `submitted_at`. The visitor
   confirmation template receives only `{{ custom.first_name }}` and
   `{{ custom.locale }}`: nothing else the visitor typed is echoed back to an
   address we have not verified.
3. Do not use `|safe` on those tokens. They carry visitor input.
4. Set `HUBSPOT_ACCESS_TOKEN` (scope `transactional-email`) and the template IDs
   in `HUBSPOT_NOTIFY_EMAIL_ID` / `HUBSPOT_CONFIRM_EMAIL_ID`.

Behaviour worth knowing:

- The endpoint succeeds when either channel accepted the lead, and returns 502
  with a reference like `HS-1A2B3C4D` when neither did. Every failure is logged
  once against that reference.
- A refusal HubSpot reports inside a 200 (bounced before, unsubscribed, bad
  template) is a failure here. It is never counted as a delivery.
- Each submission carries an idempotency key, so a retry after a timeout cannot
  send the same email twice.
- `localhost`, `*.vercel.app` and `*.pages.dev` skip the CRM write and are left
  out of the GA4 conversion, so a test submission cannot look like a lead. Set
  `HUBSPOT_ALLOW_DEV_SUBMIT=1` to point them at a sandbox portal instead.

See `.env.example` for every variable. Set them in Vercel under Project Settings,
Environment Variables. The token is server-side only and must never be renamed to
`PUBLIC_`.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
