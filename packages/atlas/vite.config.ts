/// <reference types="vitest" />
import { babel } from '@rollup/plugin-babel'
import inject from '@rollup/plugin-inject'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

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
  test: {
    environment: 'happy-dom',
    setupFiles: ['vitest-setup.ts'],
    globals: true,
  },
  // This should fix https://github.com/Joystream/atlas/issues/3005
  worker: {
    format: 'es',
  },
  plugins: [
    {
      name: 'embedded-fallback',
      configureServer(server) {
        server.middlewares.use('/embedded', (req, res, next) => {
          if (req.url.includes('.')) {
            next()
            return
          }
          req.url = '/index.html'
          req.originalUrl = '/embedded/index.html'
          next()
        })
      },
    },
    react({
      exclude: /\.stories\.[tj]sx?$/,
    }),
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./**/*.{js,jsx,ts,tsx}"' },
      overlay: false,
    }),
    babel({
      extensions: ['.tsx', '.ts'],
      include: ['**/*.style.*', '**/*.styles.*'],
      plugins: ['@emotion'],
      compact: false,
      babelHelpers: 'bundled',
    }),
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
    include: ['buffer', 'blake3/browser-async', 'multihashes', '@emotion/styled/base'],
  },
})
