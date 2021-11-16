import { babel } from '@rollup/plugin-babel'
import graphql from '@rollup/plugin-graphql'
import inject from '@rollup/plugin-inject'
import react from '@vitejs/plugin-react'
import path from 'path'
import docgen from 'react-docgen-typescript-vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      exclude: /\.stories\.(t|j)sx?$/,
    }),
    checker({
      typescript: true,
      eslint: { files: ['./src'], extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      overlay: false,
    }),
    babel({
      extensions: ['.tsx', '.ts'],
      include: ['src/**/*.style.*', 'src/**/*.styles.*'],
      plugins: ['@emotion'],
      compact: false,
      babelHelpers: 'bundled',
    }),
    graphql(),
    docgen(['src/**/*.tsx']),
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
})
