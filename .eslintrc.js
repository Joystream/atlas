module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // turns off the rules which may conflict with prettier
    'prettier',
  ],
  plugins: ['@emotion', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // taken care of by typescript
    'react/prop-types': 'off',

    // disable explicit return types
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // allow "_" prefixed function arguments
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { 'args': 'after-used', 'argsIgnorePattern': '^_', 'ignoreRestSiblings': true },
    ],

    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          object: false,
        },
      },
    ],

    // force using Logger object
    'no-console': ['warn'],

    // make sure we use the proper Emotion imports
    '@emotion/pkg-renaming': 'error',
    '@emotion/no-vanilla': 'error',
    '@emotion/syntax-preference': [2, 'string'],
  },
}
