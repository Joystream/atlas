import { create } from '@storybook/theming'

import logo from '../src/assets/logos/svgs/joystream-logo-full.svg'

export default create({
  base: 'dark',
  brandTitle: '@joystream/atlas',
  brandUrl: 'https://joystream.org',
  brandImage: logo,
})
