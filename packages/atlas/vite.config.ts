/// <reference types="vitest" />
import ViteYaml from '@modyfi/vite-plugin-yaml'
import babel from '@rollup/plugin-babel'
import react from '@vitejs/plugin-react'
import { load as loadYaml } from 'js-yaml'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

// read config file - we cannot use `@/config` since it relies on YAML plugin being already loaded and that's not done in this context
const rawConfigPath = path.resolve(__dirname, 'atlas.config.yml')
const rawConfig = fs.readFileSync(rawConfigPath, 'utf-8')
const parsedConfig = loadYaml(rawConfig) as { general: unknown }

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  build: {
    target: ['chrome87', 'edge88', 'es2020', 'firefox78', 'safari14'],
    emptyOutDir: true,
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        embedded: path.resolve(__dirname, 'src/embedded/index.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['vitest-setup.ts'],
    globals: true,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }, // workaround for vite, esbuild and babel integration bug: https://github.com/vitejs/vite/issues/8644
  },
  worker: {
    plugins: [
      // This plugin fixes:
      // https://github.com/Joystream/atlas/issues/3005
      // By default vite was transpiling `import.meta.url` (that you can find in `node_modules/@polkadot/api/packageInfo.js`)
      // to the code which uses `document.baseURI`. `Document` is not available in workers and in the result we got reference errors.
      // This plugin replace `document.baseURI` with `self.location.href` which should be available in the worker
      {
        name: 'resolve-import-meta-polkadot',
        resolveImportMeta(_, { chunkId }) {
          if (chunkId.includes('polkadot-worker')) {
            return 'self.location.href'
          }
        },
      },
    ],
  },
  plugins: [
    {
      name: 'html-config-transform',
      transformIndexHtml: {
        enforce: 'pre',
        transform: (html: string) => html.replace(/%(.*?)%/g, (match, p1) => parsedConfig.general[p1] ?? match),
      },
    },
    {
      name: 'embedded-fallback',
      configureServer(server) {
        server.middlewares.use('/embedded', (req, res, next) => {
          if (req.url?.includes('.')) {
            next()
            return
          }
          req.url = '/index.html'
          req.originalUrl = '/embedded/index.html'
          next()
        })
      },
    },
    ViteYaml(),
    react({
      exclude: /\.stories\.[tj]sx?$/,
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./**/*.{js,jsx,ts,tsx}"',
        dev: { overrideConfig: { ignorePath: '../.eslintignore' } },
      },
      overlay: false,
    }),
    babel({
      extensions: ['.tsx', '.ts'],
      include: ['**/*.style.*', '**/*.styles.*'],
      plugins: ['@emotion'],
      babelHelpers: 'bundled',
    }),
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
    include: ['blake3/browser-async', 'multihashes'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
