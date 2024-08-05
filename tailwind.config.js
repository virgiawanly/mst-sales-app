/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A3CF1",
          50: "#EDECFE",
          100: "#DCD9FC",
          200: "#B9B3FA",
          300: "#9188F6",
          400: "#6E62F4",
          500: "#4A3CF1",
          600: "#2110E0",
          700: "#190CA7",
          800: "#110872",
          900: "#090439",
          950: "#04021D",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
