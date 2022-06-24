/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'main-sand': '#cdbd9a',
        'main-grey': '#c1c1c1'
      },
      fontFamily: {
        sans: ['camingocoderegular'],
        serif: ['camingocoderegular'],
        mono: ['camingocoderegular']
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer')
  ]
}