import { Options, StorybookConfig } from '@storybook/core-common'
import { UserConfig } from 'vite'

import _viteConfig from '../vite.config'

interface CustomizedStorybookConfig extends StorybookConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  core: any
  viteFinal?: (config: UserConfig, options: Options) => UserConfig
}

const config: CustomizedStorybookConfig = {
  'stories': ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  'addons': ['@storybook/addon-links', '@storybook/addon-essentials'],
  'core': {
    'builder': 'storybook-builder-vite',
  },
  viteFinal(storybookConfig, { configType }) {
    if (configType === 'DEVELOPMENT') {
      storybookConfig.build = {}
    }
    storybookConfig.build.target = ''
    const viteConfig = _viteConfig as UserConfig
    // @ts-ignore complains about flat
    const vitePlugins = Array.isArray(viteConfig.plugins) ? viteConfig.plugins.flat() : []
    const filteredVitePlugins = vitePlugins.filter(
      (plugin) =>
        // @ts-ignore totally justified ignore
        plugin.name !== 'vite:react-babel' &&
        // @ts-ignore totally justified ignore
        plugin.name !== 'vite:react-refresh' &&
        // @ts-ignore totally justified ignore
        plugin.name !== 'vite:react-jsx' &&
        // @ts-ignore totally justified ignore
        plugin.name !== 'vite-plugin-checker'
    )
    const merged: UserConfig = {
      ...storybookConfig,
      plugins: [...(storybookConfig.plugins || []), ...filteredVitePlugins],
      optimizeDeps: {
        ...storybookConfig.optimizeDeps,
        include: [...(storybookConfig.optimizeDeps?.include || []), ...(viteConfig.optimizeDeps?.include || [])],
      },
      resolve: {
        alias: {
          ...storybookConfig.resolve?.alias,
          ...viteConfig.resolve?.alias,
        },
      },
    }
    return merged
  },
}

export default config
