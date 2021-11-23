const config = require('./figma-import.config')

const path = require('path')
const fs = require('fs').promises
const { kebabCase } = require('lodash')

const { getImageContent, getNodeChildren, getSvgImageUrl } = require('./utils/api')

const iconsDir = path.resolve('src/components/_icons/svgs')

let counter = 0

/**
 * clear icons dir
 *
 */
const clearIconsDir = async () => {
  try {
    await fs.rm(iconsDir, { recursive: true })
    console.log(`${iconsDir} successfully deleted!`)
  } catch (err) {
    console.error(`Error while deleting ${iconsDir}`)
  }
}

/**
 * generate icon content
 * [iconName].svg files
 *
 * @param {object} iconNode
 * @param {number} total
 * @return {Promise<void>}
 */
const generateIcon = async (iconNode, total) => {
  const iconUrl = await getSvgImageUrl(iconNode.id)

  const iconName = kebabCase(iconNode.name)

  try {
    await fs.access(iconsDir)
  } catch (error) {
    await fs.mkdir(iconsDir)
  }

  const { data: iconContent } = await getImageContent(iconUrl)

  await Promise.all([await fs.writeFile(path.resolve(iconsDir, `${iconName}.svg`), iconContent, 'utf-8')])

  counter++
  process.stdout.write(` ${counter}/${total} icons has been saved\r`)
  if (counter === total) {
    console.info('All svgs has been saved')
  }
}

/**
 * generate icons components
 *
 * @param {[Object]} iconNodesArr - array of icon nodes from frame
 * @return {Promise<void>}
 */
const generateIcons = async (iconNodesArr) => {
  await Promise.all(
    iconNodesArr.map((item, index) => {
      setTimeout(() => generateIcon(item, iconNodesArr.length), 1000 * index)
    })
  )
}

const main = async () => {
  clearIconsDir()

  const iconNodesArr = await getNodeChildren(config.FRAME_WITH_ICONS_ID)

  await Promise.all([generateIcons(iconNodesArr)])
}

module.exports = main
