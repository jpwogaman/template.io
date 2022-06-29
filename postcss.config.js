module.exports = {
  plugins: {
    'postcss-import': {},
    autoprefixer: {},
    tailwindcss: {},
    'postcss-focus-visible': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3,
      features: {
        'custom-properties': false
      }
    }
  }
}