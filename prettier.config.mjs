/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  jsxSingleQuote: true,
  singleQuote: true,
  semi: false,
  tabWidth: 2,
  trailingComma: 'none',
  bracketSameLine: true,
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 80,
  singleAttributePerLine: true
}

export default config
