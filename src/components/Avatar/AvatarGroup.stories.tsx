import { Meta, Story } from '@storybook/react'
import React from 'react'

import { AvatarGroup, AvatarGroupProps } from './AvatarGroup'

export default {
  title: 'other/AvatarGroup',
  component: AvatarGroup,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['default', 'bid', 'small'],
      },
      defaultValue: 'default',
    },
  },
} as Meta

const Template: Story<AvatarGroupProps> = (args) => <AvatarGroup {...args} />

export const Default = Template.bind({})

Default.args = {
  avatars: [
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'Jane' },
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'John' },
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'William' },
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'One line description' },
  ],
}
