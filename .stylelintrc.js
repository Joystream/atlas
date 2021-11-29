module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  defaultSeverity: 'warning',
  customSyntax: '@stylelint/postcss-css-in-js',
  rules: {
    'function-name-case': null,
    'custom-property-empty-line-before': null,
    'unit-no-unknown': null,
    'value-keyword-case': null,
    'font-family-name-quotes': null,
    'declaration-block-no-duplicate-properties': true,
    'alpha-value-notation': 'number',
    'rule-empty-line-before': [
      'always',
      {
        'ignore': 'first-nested',
      },
    ],
  },
}
