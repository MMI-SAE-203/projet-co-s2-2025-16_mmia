/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class', // ESSENTIEL pour que dark: fonctionne
    theme: {
      extend: {
        // Vos extensions personnalisées ici si besoin
      },
    },
    plugins: [],
  }