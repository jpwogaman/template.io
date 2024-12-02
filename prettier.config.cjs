/** @type {import("prettier").Config} */
//https://prettier.io/docs/en/options.html
module.exports = {
  jsxSingleQuote: true,
  singleQuote: true,
  semi: false,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'none',
  bracketSameLine: true,
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 80,
  singleAttributePerLine: true,
  overrides: [
    {
      files: ['*.html', '*.jsx', '*.tsx'],
      options: {
        plugins: ['prettier-plugin-tailwindcss']
      }
    },
    {
      files: '*.rs',
      options: {
        endOfLine: 'lf',
        plugins: [require.resolve('prettier-plugin-rust')]
      }
    }
  ]
}