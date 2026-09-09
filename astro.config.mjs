import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tailcast.vercel.app',
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
