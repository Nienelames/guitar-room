/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Pages/**/*.cshtml", "./Areas/**/*.cshtml", "./wwwroot/js/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

