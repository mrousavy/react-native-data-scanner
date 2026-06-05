const reactNativeConfig = require('@react-native/eslint-config/flat')
const prettierPlugin = require('eslint-plugin-prettier')

const prettierOptions = {
  quoteProps: 'consistent',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
}

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'lib/**',
      'android/build/**',
      'nitrogen/generated/**',
    ],
  },
  ...reactNativeConfig.filter((config) => config.plugins?.['ft-flow'] == null),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['warn', prettierOptions],
    },
  },
]
