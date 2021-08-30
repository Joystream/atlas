import { babel } from '@rollup/plugin-babel'
import graphql from '@rollup/plugin-graphql'
import inject from '@rollup/plugin-inject'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    inject({
      include: ['node_modules/**/*.js*'],
      modules: {
        Buffer: ['buffer', 'Buffer'],
      },
    }),
    reactRefresh(),
    babel({
      extensions: ['.tsx', '.ts'],
      include: ['src/**/*.style.*', 'src/**/*.styles.*'],
      plugins: ['@emotion'],
      compact: false,
      babelHelpers: 'bundled',
    }),
    graphql(),
  ],
  optimizeDeps: {
    include: ['buffer'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
