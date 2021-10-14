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
    // Adding a custom format to show how to get an alias's name.
    customFormat: ({ dictionary, options }) => {
      // console.log(dictionary.allTokens, options)

      return `import { css } from '@emotion/react'

export const globalStyles = css\`
  :root {
  ${dictionary.allTokens
    .map((token) => {
      let value = JSON.stringify(token.value)
      // new option added to decide whether or not to output references
      if (options.outputReferences) {
        // the `dictionary` object now has `usesReference()` and
        // `getReferences()` methods. `usesReference()` will return true if
        // the value has a reference in it. `getReferences()` will return
        // an array of references to the whole tokens so that you can access
        // their names or any other attributes.
        if (dictionary.usesReference(token.original.value)) {
          const refs = dictionary.getReferences(token.original.value)
          refs.forEach((ref) => {
            value = value.replace(ref.value, function () {
              return `${ref.name}`
            })
          })
        }
      }

      return `--${token.name}: ${value};`
    })
    .join(`\n`)}
  }
    \`
    
`
    },
  },
  platforms: {
    css: {
      transforms: [`attribute/cti`, `name/cti/kebab`],
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: `variables.css`,
          format: `css/variables`,
          options: {
            'outputReferences': true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: 'variables.js',
          format: 'customFormat',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}
