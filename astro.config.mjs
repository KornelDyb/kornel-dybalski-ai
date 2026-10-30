// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kornel-dybalski.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
