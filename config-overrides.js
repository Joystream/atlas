/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { override, addBabelPreset, addBabelPlugin, addWebpackAlias, addWebpackModuleRule } = require('customize-cra')

module.exports = {
  webpack: override(
    addBabelPlugin('babel-plugin-emotion'),
    addBabelPreset('@emotion/babel-preset-css-prop'),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src/'),
    }),
    addWebpackModuleRule({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
  ),
  paths: (paths) => {
    paths.appBuild = path.resolve(__dirname, 'dist')
    return paths
  },
}
