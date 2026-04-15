import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://virtuslab.github.io',
  base: '/visdom-main-page',
  vite: {
    plugins: [tailwindcss()],
  },
});
