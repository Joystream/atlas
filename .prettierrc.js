module.exports = {
  ...require('@joystream/prettier-config'),
  plugins: ['stylelint-prettier'],
  printWidth: 120,
  importOrder: ['^@/(.*)$', '^./', '^[./]'],
  experimentalBabelParserPluginsList: ['jsx', 'typescript'],
  importOrderSeparation: true,
}
