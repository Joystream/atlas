/* eslint-disable @typescript-eslint/no-var-requires */
const { template, camelCase } = require('lodash')

const variablesTemplate = template(`import { css } from '@emotion/react'
export const variables = css\`
  :root {
    <%= cssVariables %>
  }\`
export const theme = {
  <%= themeVariables %>
}
export const cVar = (key: keyof typeof theme, returnValue?: boolean) => {
  if (returnValue) return theme[key].value
  return theme[key].variable
}
`)

module.exports = {
  source: [`./src/styles/tokens/**/*.json`],
  parsers: [
    {
      pattern: /\.json$/,
      parse: ({ contents }) => {
        // style dictionary requires adding ".value" suffix to all referenced value,  e.g.  "value": "{core.neutral.default.900}" should be  e.g.  "value": "{core.neutral.default.900.value}"
        // this parser should fix it, although it just a workaround
        // we could remove this when they do something about it https://github.com/amzn/style-dictionary/issues/721
        const parsed = contents.replace(/}"|\.value}"/g, `.value}"`)
        return JSON.parse(parsed)
      },
    },
  ],
  transform: {
    removeDefaultFromName: {
      type: 'name',
      transformer: (token) => token.name.replace(/-default|-regular/g, ''),
    },
    easingTransform: {
      type: 'value',
      matcher: (token) => token.attributes.type === 'easing',
      // [1, 2, 3, 4] will become 1, 2, 3, 4
      transformer: (token) => `cubic-bezier(${token.value.toString().replace(/\[|\]/g, '')})`,
    },
    transitionTransform: {
      type: 'value',
      transitive: true,
      matcher: (token) => token.attributes.type === 'transition',
      transformer: (token) => `${token.value.timing} ${token.value.easing}`,
    },
    typographyValueTransform: {
      type: 'value',
      transitive: true,
      matcher: (token) => token.attributes.type === 'textStyles',
      transformer: (token) =>
        `${token.value.fontWeight} ${token.value.fontSize}/${token.value.lineHeight} ${token.value.fontFamily}`,
    },
    typographyNameTransform: {
      type: 'name',
      matcher: (token) => token.attributes.type === 'textStyles',
      transformer: (token) => token.name.replace(/-heading|-text|-styles/g, ''),
    },
    effectsTransform: {
      type: 'value',
      transitive: true,
      matcher: (token) => token.attributes.category === 'effect',
      transformer: (token) => {
        const isDivider = token.attributes.type === 'dividers'
        return `${isDivider ? 'inset' : ''} ${token.value.x} ${token.value.y} ${token.value.blur} ${
          token.value.spread
        } ${token.value.color}`
      },
    },
  },
  format: {
    customFormat: ({ dictionary }) => {
      // create new tokens for letter-spacing
      const allTokens = dictionary.allTokens
      const letterSpacingTokens = allTokens
        .filter((token) => token.attributes.type === 'textStyles')
        .map((token) => ({
          ...token,
          value: token.original.value.letterSpacing || 0,
          name: `${token.name}-letter-spacing`,
        }))

      // create new tokens for text-transform
      const textTransformTokens = allTokens
        .filter((token) => token.attributes.type === 'textStyles')
        .map((token) => ({
          ...token,
          value: token.original.value.textTransform || 'none',
          name: `${token.name}-text-transform`,
        }))

      const convertedTokens = [...allTokens, ...letterSpacingTokens, ...textTransformTokens]
      return variablesTemplate({
        cssVariables: convertedTokens
          .map((token) => {
            let keyValuePair = `--${token.name}: ${token.value};`
            if (dictionary.usesReference(token.original.value)) {
              const refs = dictionary.getReferences(token.original.value)

              refs.forEach((ref) => {
                const [key, value] = keyValuePair.split(':')
                const modifiedValue = value.replace(ref.value, `var(--${ref.name})`)
                keyValuePair = `${key}:${modifiedValue}`
              })
            }
            return keyValuePair
          })
          .join('\n'),
        themeVariables: convertedTokens
          .map((token) => `${camelCase(token.name)}: { variable: 'var(--${token.name})', value: '${token.value}' },`)
          .join('\n'),
      })
    },
  },
  platforms: {
    ts: {
      transforms: [
        `attribute/cti`,
        `name/cti/kebab`,
        'removeDefaultFromName',
        'typographyValueTransform',
        'typographyNameTransform',
        'easingTransform',
        'transitionTransform',
        'effectsTransform',
      ],
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: 'variables.ts',
          format: 'customFormat',
          filter: (token) => token.type !== 'typedef',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}
