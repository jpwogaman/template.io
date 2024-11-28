import { type Config } from 'tailwindcss'

export default {
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
        code: ['camingocoderegular'],
        codeItalic: ['camingocodeitalic'],
        codeBold: ['camingocodebold'],
        codeBoldItalic: ['camingocodebold_italic']
      }
    }
  },
  plugins: []
} satisfies Config