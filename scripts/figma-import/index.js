const importIcons = require('./icons')
const config = require('./figma-import.config')

const configTest = () => {
  const missingFields = []
  if (!config.hasOwnProperty('FIGMA_TOKEN')) missingFields.push('figmaToken')
  if (!config.hasOwnProperty('FILE_KEY')) missingFields.push('FILE_KEY')
  if (!config.hasOwnProperty('FRAME_WITH_ICONS_ID')) missingFields.push('FRAME_WITH_ICONS_ID')

  if (missingFields.length) {
    throw new Error(
      `The following fields are missing in the configuration file:${missingFields.map((item) => ` ${item}`)}`
    )
  }
}

const main = async () => {
  await importIcons()
}

try {
  configTest()
  main()
} catch (error) {
  console.error('Unhandled rejection', error)
}
