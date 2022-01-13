import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Avatar, AvatarProps } from './Avatar'

export default {
  title: 'other/Avatar',
  component: Avatar,
  argTypes: {
    assetUrl: {
      type: 'string',
      defaultValue: 'https://picsum.photos/200/300',
    },
    size: {
      control: {
        type: 'select',
        options: ['preview', 'cover', 'default', 'fill', 'bid', 'small', 'channel', 'channel-card'],
      },
      defaultValue: 'channel',
    },
    editable: { type: 'boolean', defaultValue: false },
    loading: { type: 'boolean', defaultValue: false },
  },
} as Meta

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />

export const Default = Template.bind({})

export const WithAvatar = Template.bind({})
WithAvatar.args = {
  assetUrl: 'https://picsum.photos/200/300',
}
