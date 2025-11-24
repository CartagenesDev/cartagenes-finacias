/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#DAA520',
          dark: '#B8860B',
          light: '#FFD700',
          red: '#8B0000',
        }
      }
    },
  },
  plugins: [],
}