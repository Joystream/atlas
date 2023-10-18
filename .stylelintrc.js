module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  defaultSeverity: 'warning',
  customSyntax: '@stylelint/postcss-css-in-js',
  rules: {
    'function-url-quotes': null,
    'no-empty-source': null,
    'function-name-case': null,
    'custom-property-empty-line-before': null,
    'unit-no-unknown': null,
    'value-keyword-case': null,
    'font-family-name-quotes': null,
    'function-no-unknown': null,
    'annotation-no-unknown': null,
    'declaration-block-no-duplicate-properties': true,
    'selector-not-notation': 'simple',
    'alpha-value-notation': 'number',
    'rule-empty-line-before': [
      'always',
      {
        'ignore': 'first-nested',
      },
    ],
  },
}
