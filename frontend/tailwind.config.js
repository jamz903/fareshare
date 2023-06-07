/** @type {import('tailwindcss').Config} */
module.exports = {
  content:
    ["./src/features/**/*.{js, jsx, ts, tsx}",
      "./src/**/*.{js, jsx, ts, tsx}",
      "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        'sans': 'Inter',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'black': '#09080C',
        'seasalt': '#F8F7F6', // Seasalt (off-white)
        'primary': '#05387B', // Yale Blue (darker blue)
        'secondary': '#1B9AAA', // Munsell Blue (lighter blue)
        'tertiary': '#FFC759', // Xanthous (yellow)
      },
    },
  },
  plugins: [],
}

