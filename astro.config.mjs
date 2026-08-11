import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
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
