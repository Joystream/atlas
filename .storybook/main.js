/* eslint-disable @typescript-eslint/no-var-requires */

const { merge } = require('webpack-merge')
const path = require('path')
const fs = require('fs')
const reactConfig = require('../config-overrides')

// TODO: related to an issue with emotion and storybook, remove once resolved https://github.com/storybookjs/storybook/issues/7540
function getPackageDir(filepath) {
  let currDir = path.dirname(require.resolve(filepath))
  while (true) {
    if (fs.existsSync(path.join(currDir, 'package.json'))) {
      return currDir
    }
    const { dir, root } = path.parse(currDir)
    if (dir === root) {
      throw new Error(`Could not find package.json in the parent directories starting from ${filepath}.`)
    }
    currDir = dir
  }
}

module.exports = {
  stories: ['./Welcome.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-create-react-app'],

  webpackFinal: async (config) => {
    const craConfig = reactConfig.webpack(config)
    return merge(craConfig, {
      resolve: {
        alias: {
          '@emotion/core': getPackageDir('@emotion/react'),
          '@emotion/styled': getPackageDir('@emotion/styled'),
          'emotion-theming': getPackageDir('@emotion/react'),
        },
      },
    })
  },
}
