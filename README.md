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
   `company`, `message`. A field the form does not define is dropped and the
   submission is retried, so a missing optional field costs data, not the lead.
2. Set the form's notification recipients, and its follow-up email if the visitor
   should get a confirmation. That copy lives in HubSpot on purpose: marketing can
   change it without a deploy.
3. Set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID`.
4. Optional: a private app token in `HUBSPOT_ACCESS_TOKEN` with the `forms` scope
   uses the authenticated endpoint, which has higher rate limits. Without the
   scope the endpoint falls back to the public one automatically.

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
