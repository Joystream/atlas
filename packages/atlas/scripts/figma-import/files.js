const config = require('./figma-import.config')

const path = require('path')
const fs = require('fs').promises
const {kebabCase} = require('lodash')

const {getImageContent, getNodeChildren, getSvgImageUrl} = require('./utils/api')

const type = process.argv.slice(2)[0] === '--icons' ? 'icons' : 'illustrations'
const filesDir = path.resolve(`src/components/_${type}/svgs`)

let counter = 0

/**
 * clear files dir
 *
 */
const clearFilesDir = async () => {
  try {
    await fs.rm(filesDir, {recursive: true})
    console.log(`${filesDir} successfully deleted!`)
  } catch (err) {
    console.error(`Error while deleting ${filesDir}`)
  }
}

/**
 * generate icon/illustration content
 * [fileName].svg files
 *
 * @param {object} svgNode
 * @param {number} total
 * @return {Promise<void>}
 */
const generateIconOrIllustration = async (svgNode, total) => {
  const fileUrl = await getSvgImageUrl(svgNode.id)

  const fileName = kebabCase(svgNode.name)

  try {
    await fs.access(filesDir)
  } catch (error) {
    await fs.mkdir(filesDir)
  }

  const {data: fileContent} = await getImageContent(fileUrl)

  await Promise.all([await fs.writeFile(path.resolve(filesDir, `${fileName}.svg`), fileContent, 'utf-8')])

  counter++
  process.stdout.write(` ${counter}/${total} files has been saved\r`)
  if (counter === total) {
    console.info('All svgs has been saved')
  }
}

/**
 * generate icons/illustrations components
 *
 * @param {[Object]} svgNodesArr - array of svgs from frame
 * @return {Promise<void>}
 */
const generateIconsOrIllustrations = async (svgNodesArr) => {
  await Promise.all(
    svgNodesArr.map((item, index) => {
      setTimeout(() => generateIconOrIllustration(item, svgNodesArr.length), 1000 * index)
    }),
  )
}

const main = async () => {
  clearFilesDir()

  const filesNodesArr = await getNodeChildren(
    type === 'icons' ? config.FRAME_WITH_ICONS_ID : config.FRAME_WITH_ILLUSTRATIONS_ID,
  )

  await Promise.all([generateIconsOrIllustrations(filesNodesArr)])
}

module.exports = main
