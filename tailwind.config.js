/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Pages/**/*.cshtml", "./Areas/**/*.cshtml", "./wwwroot/js/site.js"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

