const typescriptPlugin = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const prettierPlugin = require('eslint-plugin-prettier')

const prettierOptions = {
  quoteProps: 'consistent',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
}

module.exports = [
  {
    ignores: [
      'eslint.config.js',
      'lib/**',
      'nitrogen/generated/**',
      'node_modules/**',
    ],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      'prettier/prettier': ['warn', prettierOptions],
    },
  },
]
