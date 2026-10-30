// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kornel-dybalski.korneldybalski.workers.dev',
  vite: {
    plugins: [tailwindcss()],
    // Nic nie jest wklejane bezpośrednio w HTML (skrypty, czcionki), żeby nagłówek CSP mógł być ścisły.
    build: { assetsInlineLimit: 0 },
  },
});
