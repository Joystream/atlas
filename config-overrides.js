/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')

const {
  override,
  addBabelPreset,
  addBabelPlugin,
  addWebpackAlias,
  addWebpackModuleRule,
  addWebpackPlugin,
} = require('customize-cra')

module.exports = {
  webpack: override(
    addBabelPlugin('@emotion/babel-plugin'),
    addWebpackPlugin(new StylelintPlugin({ files: './src/**/*.{tsx,ts}' })),
    addBabelPreset('@emotion/babel-preset-css-prop'),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src/'),
    }),
    addWebpackModuleRule({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    }),
    addWebpackModuleRule({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })
  ),
  paths: (paths) => {
    paths.appBuild = path.resolve(__dirname, 'dist')
    return paths
  },
}
