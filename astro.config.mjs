import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [react()],
  // Every page stays prerendered; the adapter exists only so the contact
  // endpoint can run as a function (src/pages/api/contact.ts opts in with
  // `prerender = false`). Without it the form would be back to a mailto.
  //
  // The GitHub Pages workflow builds the same source and cannot run functions,
  // so /api/contact 404s there. The form handles that: a failed post falls back
  // to the mailto link rather than dead-ending.
  adapter: vercel(),
  // Defaults target production at the custom domain (Vercel serves it at root).
  // The GitHub Pages workflow overrides SITE/BASE for the /visdom-main-page subpath.
  site: process.env.SITE || 'https://visdom.virtuslab.com',
  base: process.env.BASE ?? '/',
  // English stays unprefixed at the root so every existing link and campaign
  // URL keeps working; Polish lives under /pl/. No Accept-Language redirect:
  // it breaks CDN caching and takes the choice away from the reader.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
