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

const createTokenKey = (token) => {
  const baseFileName = basename(token.filePath).replace('.token.json', '')
  // singularize string
  const prefix = baseFileName.substr(-1) === 's' ? baseFileName.slice(0, -1) : baseFileName
  return `${prefix}-${token.name.replace(/-default/g, '')}`
}

module.exports = {
  source: [`./src/styles/tokens/**/*.json`],
  transform: {
    referencedValueTransform: {
      // style dictionary requires adding ".value" suffix to all referenced value,  e.g.  "value": "{core.neutral.default.900}" should be  e.g.  "value": "{core.neutral.default.900.value}"
      // this transform should fix it, although it just a workaround
      // we could remove this when they do something about it https://github.com/amzn/style-dictionary/issues/721
      type: 'value',
      transitive: true,
      matcher: (token) => token.value.value && token.type !== 'typedef',
      transformer: (token) => token.value.value,
    },
    easingTransform: {
      type: 'value',
      matcher: (token) => token.attributes.category === 'easing',
      // [1, 2, 3, 4] will become 1, 2, 3, 4
      transformer: (token) => `cubic-bezier(${token.value.toString().replace(/\[|\]/g, '')})`,
    },
    transitionTransform: {
      type: 'value',
      transitive: true,
      matcher: (token) => token.attributes.category === 'transition' && token.value.timing && token.value.easing,
      transformer: (token) => `${token.value.timing.value} ${token.value.easing.value}`,
    },
  },
  format: {
    customFormat: ({ dictionary }) => {
      return variablesTemplate({
        cssVariables: dictionary.allTokens
          .map((token) => {
            if (token.type === 'typedef') {
              return
            }

            let keyValuePair = `--${createTokenKey(token)}: ${token.value};`
            if (dictionary.usesReference(token.original.value)) {
              const refs = dictionary.getReferences(token.original.value)

              refs.forEach((ref) => {
                keyValuePair = keyValuePair.replace(ref.value, ` var(--${createTokenKey(ref)})`)
              })
            }
            return keyValuePair
          })
          .join('\n'),
        themeVariables: dictionary.allTokens
          .map((token) => {
            if (token.type === 'typedef') {
              return
            }
            const variableName = createTokenKey(token)
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
      transforms: [
        `attribute/cti`,
        `name/cti/kebab`,
        'referencedValueTransform',
        'easingTransform',
        'transitionTransform',
      ],
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
