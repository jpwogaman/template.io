/** @type {import("prettier").Config} */
//https://prettier.io/docs/en/options.html
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
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
