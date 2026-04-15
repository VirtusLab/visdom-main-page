import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://arturskowronski.github.io',
  base: '/visdom-main-page',
  vite: {
    plugins: [tailwindcss()],
  },
});
