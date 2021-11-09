const config = require('../../figma-import.config')

const path = require('path')
const fs = require('fs').promises
const { pascalCase } = require('change-case')

const { getImageContent, getNodeChildren, getSvgImageUrl } = require('./utils/api')

const IconsDir = path.resolve(__dirname, '../../src/shared/icons/figmaSvgs')

const getIconFolderPath = () => path.resolve(IconsDir)

let counter = 0

/**
 * clear icons dir
 *
 */
const clearIconsDir = async () => {
  try {
    await fs.rmdir(IconsDir, { recursive: true })
    console.log(`${IconsDir} successfully deleted!`)
  } catch (err) {
    console.error(`Error while deleting ${IconsDir}.`)
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

  const iconName = pascalCase(iconNode.name)
  const iconFolderPath = getIconFolderPath(iconName)

  try {
    await fs.access(iconFolderPath)
  } catch (error) {
    await fs.mkdir(iconFolderPath)
  }

  const { data: iconContent } = await getImageContent(iconUrl)

  await Promise.all([await fs.writeFile(path.resolve(iconFolderPath, `${iconName}.svg`), iconContent, 'utf-8')])

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
