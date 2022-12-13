import { Meta, StoryFn } from '@storybook/react'

import { AppLogo, AppLogoProps } from './AppLogo'

export default {
  title: 'other/AppLogo',

  component: AppLogo,
} as Meta<AppLogoProps>

const Template: StoryFn<AppLogoProps> = (args) => <AppLogo height={32} width={undefined} {...args} />

export const Default = Template.bind({})
