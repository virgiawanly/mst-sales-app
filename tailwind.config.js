/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A3CF1',
          50: '#EDECFE',
          100: '#DCD9FC',
          200: '#B9B3FA',
          300: '#9188F6',
          400: '#6E62F4',
          500: '#4A3CF1',
          600: '#2110E0',
          700: '#190CA7',
          800: '#110872',
          900: '#090439',
          950: '#04021D',
        },
        zink: {
          50: '#E2EAF3',
          100: '#C8D7E9',
          200: '#92AFD3',
          300: '#5885BC',
          400: '#395F8E',
          500: '#233A57',
          600: '#1C2E45',
          700: '#132337',
          800: '#0F1824',
          900: '#070C12',
          950: '#030507',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
