/** @type {import('tailwindcss').Config} */
module.exports = {
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
  plugins: [  ]
}