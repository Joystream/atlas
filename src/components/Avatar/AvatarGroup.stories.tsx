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
        options: ['small', 'medium', 'large'],
      },
    },
    avatarStrokeColor: {
      control: {
        type: 'color',
      },
    },
    avatars: { table: { disable: true } },
    direction: {
      control: {
        type: 'radio',
        options: ['left', 'right'],
      },
    },
  },
  args: {
    clickable: true,
    size: 'medium',
    direction: 'left',
  },
} as Meta

const Template: Story<AvatarGroupProps> = (args) => (
  <div style={{ width: '500px', height: '500px', background: args.avatarStrokeColor, paddingTop: '30px' }}>
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
