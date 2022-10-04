import ViteYaml from '@modyfi/vite-plugin-yaml'
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
      root: viteConfig.root,
      resolve: viteConfig.resolve,
      build: {
        target: viteConfig.build?.target,
        // https://github.com/storybookjs/builder-vite/issues/409
        minify: false,
        sourcemap: false,
      },
      // eslint-disable-next-line
      plugins: [viteConfig.plugins?.find((p) => (p as any).name === 'babel'), ViteYaml()],
    })
  },
}

export default config
