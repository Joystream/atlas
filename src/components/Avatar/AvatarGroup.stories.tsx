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
    avatars: { table: { disable: true } },
  },
  args: {
    clickable: true,
  },
} as Meta

const Template: Story<AvatarGroupProps> = (args) => (
  <div style={{ marginTop: '30px' }}>
    <AvatarGroup {...args} />
  </div>
)

export const Default = Template.bind({})

Default.args = {
  avatars: [
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'Jane' },
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'John' },
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'William' },
    { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'One line description' },
  ],
}
