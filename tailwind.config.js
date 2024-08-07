/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
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
        surface: {
          50: '#f7f9fc', // Lightest
          100: '#f0f0ff',
          150: '#e1e1fc',
          200: '#d0d0f8',
          250: '#c4c4f2',
          300: '#b6b7e8',
          350: '#a8aadf',
          400: '#9a9ed6',
          450: '#8b8fdc',
          500: '#7b7bd4',
          550: '#6a66cc',
          600: '#5850e2',
          650: '#4a3cf1', // Primary Color
          700: '#393965',
          750: '#2e2e50',
          800: '#242439',
          850: '#1b1b29',
          900: '#12121c',
          950: '#0a0a0f', // Darkest
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
