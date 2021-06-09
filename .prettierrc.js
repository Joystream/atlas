module.exports = {
  ...require('@joystream/prettier-config'),
  printWidth: 120,
  importOrder: ['^@/(.*)$', '^./', '^[./]'],
  experimentalBabelParserPluginsList: ['jsx', 'typescript'],
  importOrderSeparation: true,
}
