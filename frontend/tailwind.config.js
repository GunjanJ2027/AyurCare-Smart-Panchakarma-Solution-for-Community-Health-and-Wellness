/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayurGreen: '#2D5A27',
        ayurLight: '#E8F3E8',
      }
    },
  },
  plugins: [],
}