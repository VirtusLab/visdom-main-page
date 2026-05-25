import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: process.env.SITE || 'https://virtuslab.github.io',
  base: process.env.BASE ?? '/visdom-main-page',
  vite: {
    plugins: [tailwindcss()],
  },
});
