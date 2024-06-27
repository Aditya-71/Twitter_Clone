/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Adjust paths as necessary
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          light: '#616161',
          dark: '#1e1e1e',
        },
      },
    },
  },
  darkMode: 'class', // Use 'media' if you prefer
  plugins: [],
};


