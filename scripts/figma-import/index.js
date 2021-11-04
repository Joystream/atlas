const importIcons = require('./icons')

const main = async () => {
  await importIcons()
}

try {
  main()
} catch (error) {
  console.error('Unhandled rejection', err)
}
