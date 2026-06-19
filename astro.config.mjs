import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  // Defaults target production at the custom domain (Vercel serves it at root).
  // The GitHub Pages workflow overrides SITE/BASE for the /visdom-main-page subpath.
  site: process.env.SITE || 'https://visdom.virtuslab.com',
  base: process.env.BASE ?? '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
