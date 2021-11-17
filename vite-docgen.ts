import { generateDocgenCodeBlock } from '@storybook/react-docgen-typescript-plugin/dist/generateDocgenCodeBlock'
import globby from 'globby'
import * as docGen from 'react-docgen-typescript'
import * as tsconfig from 'tsconfig'
import { ModuleResolutionKind, createProgram } from 'typescript'
import { Plugin } from 'vite'

const pattern = /\.tsx$/

/**
 * Vite react typescript document generator plugin for storybook
 *
 * **Notice**: This plugin is very slow
 *
 * @param include files that should be included
 * @param context tsconfig file root, by default it is `process.cwd()`
 */
const docgenPlugin = (include: string[], context: string = process.cwd()): Plugin => {
  const files = globby.sync(include)
  const { compilerOptions } = tsconfig.loadSync(context).config
  const tscfg = {
    ...compilerOptions,
    moduleResolution: ModuleResolutionKind.NodeJs,
  }
  const docGenParser = docGen.withCompilerOptions(tscfg, {
    propFilter: (prop) => {
      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
          return !declaration.fileName.includes('node_modules')
        })

        return Boolean(hasPropAdditionalDescription)
      }

      return true
    },
  })

  const tsProgram = createProgram(files, tscfg)
  return {
    name: 'react-docgen-plugin',
    transform(source, id) {
      if (!pattern.test(id)) return null
      const docs = docGenParser.parseWithProgramProvider(id, () => tsProgram)
      return generateDocgenCodeBlock({
        filename: id,
        source,
        componentDocs: docs,
        docgenCollectionName: 'STORYBOOK_REACT_CLASSES',
        setDisplayName: true,
        typePropName: 'type',
      })
    },
  }
}

export default docgenPlugin
