const config = require('./figma-import.config')

const path = require('path')
const readline = require('readline')
const fs = require('fs').promises
const { kebabCase } = require('lodash')

const { getImageContent, getNodeChildren, getSvgImageUrl } = require('./utils/api')

const type = process.argv.slice(2)[0] === '--icons' ? 'icons' : 'illustrations'
const filesDir = path.resolve(`src/assets/${type}/svgs`)

let counter = 0

const checkIfFileExists = async (path) => {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

const prompt = async (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (query) =>
    new Promise((resolve) =>
      rl.question(query, (answer) => {
        resolve(answer)
        rl.close()
      })
    )
  return question(query)
}

/**
 * removes array of files
 *
 */
const deleteFiles = async (files) => {
  for (const file of files) {
    try {
      const path = `${filesDir}/${file}.svg`
      const fileExists = await checkIfFileExists(path)
      if (fileExists) {
        await fs.unlink(path)
        console.log(`${file}.svg successfully deleted!`)
      }
    } catch (err) {
      console.error(`Error while deleting ${file}.svg`)
    }
  }
}
/**
 * clear files dir
 *
 */
const clearFilesDir = async () => {
  try {
    await fs.readdir(filesDir).then((files) => Promise.all(files.map((file) => fs.unlink(`${filesDir}/${file}`))))
    console.log(`${filesDir} successfully cleared!`)
  } catch (err) {
    console.error(`Error while clearing ${filesDir}`)
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

  const { data: fileContent } = await getImageContent(fileUrl)

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
  try {
    await Promise.all(
      svgNodesArr.map((item, index) => {
        setTimeout(() => generateIconOrIllustration(item, svgNodesArr.length), 1000 * index)
      })
    )
  } catch (err) {
    console.error('Error while generating icons', err)
  }
}

const main = async () => {
  try {
    const shouldRegenerateAllFiles = await prompt('Do you want to import all files? (y/n) ')

    let arrayOfFilesToGenerate = []

    if (shouldRegenerateAllFiles === 'n') {
      const filesToGenerate =
        shouldRegenerateAllFiles &&
        (await prompt('Which files do you want to import? (Provide string-separated string with no .svg extension) '))
      arrayOfFilesToGenerate = filesToGenerate.split(' ')
      await deleteFiles(arrayOfFilesToGenerate)
    } else {
      await clearFilesDir()
    }

    const filesNodesArr = await getNodeChildren(
      type === 'icons' ? config.FRAME_WITH_ICONS_ID : config.FRAME_WITH_ILLUSTRATIONS_ID
    )

    const nodesToGenerate = filesNodesArr.filter((node) =>
      arrayOfFilesToGenerate.length ? arrayOfFilesToGenerate.includes(node.name) : true
    )

    if (!nodesToGenerate?.length) {
      console.error('No nodes found')
      return
    }
    await generateIconsOrIllustrations(nodesToGenerate)
  } catch (e) {
    console.error('Unhandled error', e)
  }
}

module.exports = main
