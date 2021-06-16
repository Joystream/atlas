import { Meta, Story } from '@storybook/react'
import React from 'react'

import { AvatarProps, Avatar } from './Avatar'

export default {
  title: 'Shared/A/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: { type: 'select', options: ['preview', 'cover', 'view', 'default', 'fill', 'bar'] },
      defaultValue: 'cover',
    },
  },
} as Meta

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />

export const Default = Template.bind({})

export const WithAvatar = Template.bind({})
WithAvatar.args = {
  imageUrl: 'https://picsum.photos/200/300',
}
