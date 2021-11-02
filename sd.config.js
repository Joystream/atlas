/* eslint-disable @typescript-eslint/no-var-requires */
const { template, camelCase, kebabCase } = require('lodash')
const { basename } = require('path')

const variablesTemplate = template(`import { css } from '@emotion/react'
export const variables = css\`
  :root {
    <%= cssVariables %>
  }\`
export const theme = {
  <%= themeVariables %>
}
export const cVar = (key: keyof typeof theme) => {
  return theme[key]
}
`)

module.exports = {
  source: [`./src/styles/tokens/**/*.json`],
  parsers: [
    {
      pattern: /\.json$/,
      parse: ({ contents }) => {
        // add ".value" to every references alias - e.g.  "value": "{core.neutral.default.900}", will become  "value": "{core.neutral.default.900.value}",
        const parsed = contents.replaceAll(/}"|\.value}"/g, `.value}"`)
        return JSON.parse(parsed)
      },
    },
  ],
  format: {
    customFormat: ({ dictionary }) => {
      return variablesTemplate({
        cssVariables: dictionary.allTokens
          .map((token) => {
            const baseFileName = basename(token.filePath).replace('.token.json', '')
            // singularize string
            const prefix = baseFileName.substr(-1) === 's' ? baseFileName.slice(0, -1) : baseFileName

            let value = `--${prefix}-${token.name.replaceAll('-default', '')}: ${token.value};`

            if (dictionary.usesReference(token.original.value)) {
              const refs = dictionary.getReferences(token.original.value)

              refs.forEach((ref) => {
                value = value.replace(ref.value, ` var(--${prefix}-${ref.name.replaceAll('-default', '')})`)
              })
            }
            return value
          })
          .join('\n'),
        themeVariables: dictionary.allTokens
          .map((token) => {
            const baseFileName = basename(token.filePath).replace('.token.json', '')
            // singularize string
            const prefix = baseFileName.substr(-1) === 's' ? baseFileName.slice(0, -1) : baseFileName
            const variableName = `${prefix}-${token.name.replaceAll('-default', '')}`
            const key = camelCase(variableName)
            const value = `'var(--${kebabCase(variableName)})'`

            return `${key}: ${value},`
          })
          .join('\n'),
      })
    },
  },
  platforms: {
    ts: {
      transforms: [`attribute/cti`, `name/cti/kebab`],
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: 'variables.ts',
          format: 'customFormat',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}
