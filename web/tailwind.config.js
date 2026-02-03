/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f5',
          100: '#ffe4ed',
          200: '#ffcce0',
          300: '#ffa3c4',
          400: '#ff6b9d',
          500: '#ff3d7f',
          600: '#ed1c5f',
          700: '#c80d47',
          800: '#a60e3e',
          900: '#8a1039',
        },
      },
    },
  },
  plugins: [],
}
