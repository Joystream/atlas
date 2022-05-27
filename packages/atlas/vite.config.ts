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
  build: {
    target: ['chrome87', 'edge88', 'es2020', 'firefox78', 'safari14'],
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['vitest-setup.ts'],
  },
  plugins: [
    react({
      exclude: /\.stories\.[tj]sx?$/,
    }),
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"' },
      overlay: false,
    }),
    babel({
      extensions: ['.tsx', '.ts'],
      include: ['src/**/*.style.*', 'src/**/*.styles.*'],
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
