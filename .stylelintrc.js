module.exports = {
  extends: ['stylelint-config-recommended'],
  defaultSeverity: 'warning',
  rules: {
    'function-name-case': null,
    'custom-property-empty-line-before': null,
    'no-empty-source': null,
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
