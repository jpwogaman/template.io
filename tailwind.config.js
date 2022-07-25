/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'main-sand': '#cdbd9a',
        'main-gray': '#c1c1c1'
      },
      fontFamily: {
        sans: ['camingocoderegular'],
        serif: ['camingocoderegular'],
        mono: ['camingocoderegular']
      },
    },
  },
  variants: {
    extend: {
      textDecoration: ['focus-visible'],
      ringWidth: ['focus-visible'],
      ringColor: ['focus-visible'],
      ringOffsetWidth: ['focus-visible'],
      ringOffsetColor: ['focus-visible'],
      ringOpacity: ['focus-visible'],
      ring: ['focus-visible'],
      border: ['focus-visible']
    }
  },
  plugins: [
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer')
  ]
}