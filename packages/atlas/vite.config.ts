/// <reference types="vitest" />
import ViteYaml from '@modyfi/vite-plugin-yaml'
import babel from '@rollup/plugin-babel'
import react from '@vitejs/plugin-react'
import * as path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

import {
  AtlasHtmlMetaTagsPlugin,
  AtlasWebmanifestPlugin,
  EmbeddedFallbackPlugin,
  OptimizePlugin,
  PolkadotWorkerMetaFixPlugin,
} from './plugins'

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
    plugins: [PolkadotWorkerMetaFixPlugin],
  },
  plugins: [
    AtlasHtmlMetaTagsPlugin,
    AtlasWebmanifestPlugin,
    EmbeddedFallbackPlugin,
    OptimizePlugin,
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
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
