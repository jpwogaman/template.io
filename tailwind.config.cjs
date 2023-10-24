/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'main-sand': '#cdbd9a',
        'main-gray': '#c1c1c1'
      },
      fontFamily: {
        caviar: ['caviar_dreamsregular'],
        caviarBold: ['caviar_dreamsbold'],
        caviarItalic: ['caviar_dreamsitalic'],
        caviarBoldItalic: ['caviar_dreamsbold_italic'],

        mono: ['camingocoderegular']
      }
    }
  },
  plugins: []
}
