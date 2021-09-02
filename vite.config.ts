import { babel } from '@rollup/plugin-babel'
import graphql from '@rollup/plugin-graphql'
import inject from '@rollup/plugin-inject'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    babel({
      extensions: ['.tsx', '.ts'],
      include: ['src/**/*.style.*', 'src/**/*.styles.*'],
      plugins: ['@emotion'],
      compact: false,
      babelHelpers: 'bundled',
    }),
    graphql(),
    {
      ...inject({
        include: ['node_modules/**/*.js*'],
        modules: {
          Buffer: ['buffer', 'Buffer'],
        },
      }),
      enforce: 'post',
    },
    {
      ...visualizer({
        filename: 'dist/stats.html',
      }),
      enforce: 'post',
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  // build: {
  // commonjsOptions: {
  //   transformMixedEsModules: true,
  // ignore: (id: string) => id.includes('polkadot'),
  // esmExternals: true,
  // },
  // rollupOptions: {
  //   output: {
  //     manualChunks: {
  //       'vendors-studio': [
  //         '@polkadot/util',
  //         '@polkadot/types',
  //         '@polkadot/wasm-crypto-wasm',
  //         '@polkadot/util-crypto',
  //         '@polkadot/types',
  //         '@polkadot/keyring',
  //         '@polkadot/api',
  //         '@polkadot/api-derive',
  //         '@polkadot/rpc-core',
  //         '@polkadot/rpc-provider',
  //         '@joystream/types',
  //         '@joystream/content-metadata-protobuf',
  //       ],
  //     },
  //   },
  // },
  // },
})
