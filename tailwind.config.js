/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1a56db',
        'brand-red': '#e02424',
        'brand-light-blue': '#e1effe'
      }
    },
  },
  plugins: [],
}
