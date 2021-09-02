/* eslint-disable @typescript-eslint/no-var-requires */
const { register } = require('esbuild-register/dist/node')
register({
  target: 'node15',
})
module.exports = require('./main.ts')
