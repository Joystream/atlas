/// <reference types="vitest" />
import ViteYaml from '@modyfi/vite-plugin-yaml'
import babel from '@rollup/plugin-babel'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import * as path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'

import {
  AtlasHtmlMetaTagsPlugin,
  AtlasWebmanifestPlugin,
  EmbeddedFallbackPlugin,
  OptimizePlugin,
  PolkadotWorkerMetaFixPlugin,
} from './plugins'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/src`)
  return {
    root: './src',
    build: {
      target: ['chrome87', 'edge88', 'es2020', 'firefox78', 'safari14'],
      emptyOutDir: true,
      outDir: path.resolve(__dirname, 'dist'),
      rollupOptions: {
        output: {
          sourcemap: true,
          sourcemapIgnoreList: (relativeSourcePath) => {
            // will ignore-list all files with node_modules in their paths
            return relativeSourcePath.includes('node_modules')
          },
          manualChunks: {
            'react-lottie-player': ['@lottiefiles/react-lottie-player'],
            'crypto-js': ['crypto-js'],
            sentry: ['@sentry/react'],
            'polkadot-utils': [
              '@polkadot/util-crypto',
              '@polkadot/types',
              '@polkadot/keyring',
              '@polkadot/api',
              '@polkadot/util',
            ],
            joystream: ['@joystream/metadata-protobuf', '@joystream/js/content', '@joystream/types'],
            'video-js': ['video.js'],
            animations: [path.resolve(__dirname, 'src/assets/animations')],
            icons: [path.resolve(__dirname, 'src/assets/icons')],
            illustrations: [path.resolve(__dirname, 'src/assets/illustrations')],
          },
        },
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
      sentryVitePlugin({
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        org: 'jsgenesis',
        project: 'atlas',
      }),
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
  }
})
