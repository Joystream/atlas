module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  defaultSeverity: 'warning',
  rules: {
    'function-name-case': null,
    'custom-property-empty-line-before': null,
    'unit-no-unknown': null,
    'declaration-block-no-duplicate-properties': true,
    'value-keyword-case': null,
    'rule-empty-line-before': [
      'always',
      {
        'ignore': 'first-nested',
      },
    ],
  },
}
