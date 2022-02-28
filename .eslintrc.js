module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:jest-dom/recommended',
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
    // disable explicit return types
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // allow "_" prefixed function arguments
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { 'args': 'after-used', 'argsIgnorePattern': '^_', 'ignoreRestSiblings': true, 'varsIgnorePattern': '^_+$' },
    ],
    // taken care of by typescript
    'react/prop-types': 'off',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    'react/self-closing-comp': [
      'warn',
      {
        'component': true,
        'html': true,
      },
    ],
    // add exhaustive deps check to custom hooks
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        'additionalHooks': 'useDeepMemo',
      },
    ],
    'react/no-unescaped-entities': 'off',
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
