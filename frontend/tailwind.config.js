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
        'yellow': '#FFC759', // Xanthous (yellow)
        'red': '#EB5E55', // Bittersweet (red)
        'green': '#306B34', // Pigment Green (green)
      }
    }
  },
  plugins: [],
  safelist: [ // safelist ensures that styles are loaded properly
    {
      pattern: /(bg|text|border)-(transparent|currentColor|black|seasalt|primary|secondary|yellow|red|green)/
    }
  ]
}

