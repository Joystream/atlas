module.exports = {
  ...require('@joystream/prettier-config'),
  printWidth: 120,
  importOrder: ['^@/(.*)$', '^./', '^[./]'],
  importOrderSeparation: true,
}
