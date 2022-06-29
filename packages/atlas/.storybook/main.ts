import { Options, StorybookConfig } from '@storybook/core-common'
import { UserConfig, mergeConfig } from 'vite'

import _viteConfig from '../vite.config'

const viteConfig = _viteConfig as UserConfig

interface CustomizedStorybookConfig extends StorybookConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  core: any
  viteFinal?: (config: UserConfig, options: Options) => UserConfig
}

const config: CustomizedStorybookConfig = {
  'stories': ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  'addons': ['@storybook/addon-links', '@storybook/addon-essentials'],
  'core': {
    'builder': '@storybook/builder-vite',
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  viteFinal(config) {
    return mergeConfig(config, {
      resolve: viteConfig.resolve,
      build: viteConfig.build,
      // eslint-disable-next-line
      plugins: [viteConfig.plugins.find((p) => (p as any).name === 'babel')],
    })
  },
}

export default config
