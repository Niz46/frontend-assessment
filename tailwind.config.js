/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#013941',
        figmaBorder: '#CCF6E5',
        figmaInner: '#E0E0E0',
      },
      borderRadius: {
        card: '30px',
      },
    },
  },
  plugins: [],
};
