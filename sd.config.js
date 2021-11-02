/* eslint-disable @typescript-eslint/no-var-requires */
const { template } = require('lodash')
const { basename } = require('path')

const variablesTemplate = template(`import { css } from '@emotion/react'

export const variables = css\`
  :root {
    <%= output %>
  }\`

`)

module.exports = {
  source: [`./src/styles/tokens/**/*.json`],
  parsers: [
    {
      pattern: /\.json$/,
      parse: ({ contents }) => {
        // add "./value" to every references alias - e.g.  "value": "{core.neutral.default.900}", will become  "value": "{core.neutral.default.900.value}",
        const parsed = contents.replaceAll(/}"|\.value}"/g, `.value}"`)
        return JSON.parse(parsed)
      },
    },
  ],
  format: {
    customFormat: ({ dictionary }) => {
      return variablesTemplate({
        output: dictionary.allTokens
          .map((token) => {
            const prefix = basename(token.filePath).replace('.token.json', '')
            let value = `--${prefix}-${token.name.replaceAll('-default', '')}: ${token.value};`

            if (dictionary.usesReference(token.original.value)) {
              const refs = dictionary.getReferences(token.original.value)

              refs.forEach((ref) => {
                value = value.replace(ref.value, ` var(--${prefix}-${ref.name.replaceAll('-default', '')})`)
              })
            }
            return value
          })
          .join('\n    '),
      })
    },
  },
  platforms: {
    js: {
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
