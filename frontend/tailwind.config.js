/** @type {import('tailwindcss').Config} */
module.exports = {
  content:
    ["./src/**/*.{html, js, jsx, ts, tsx}",
      "./public/index.html",
      "./src/features/**/*.{html, js, jsx, ts, tsx}",
      "./src/*.{html, js, jsx, ts, tsx}"
    ],
  theme: {
    extend: {},
  },
  plugins: [],
}

