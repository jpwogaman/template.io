/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
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
  singleAttributePerLine: true,
  overrides: [    
    {
      files: '*.rs',
      options: {
        endOfLine: 'lf',
        plugins: [require.resolve('prettier-plugin-rust')]
      }
    }
  ]
}

export default config
