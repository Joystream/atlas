module.exports = {
  ...require('@joystream/prettier-config'),
  printWidth: 120,
  importOrder: ['^@/(.*)$', '^./', '^[./]'],
  importOrderParserPlugins: ['jsx', 'typescript'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
}
