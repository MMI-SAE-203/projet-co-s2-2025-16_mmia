// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  experimental: {
    svg: true,
    session: true,
  },

  adapter: netlify(),
});