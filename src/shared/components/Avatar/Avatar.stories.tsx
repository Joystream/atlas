import { Meta, Story } from '@storybook/react'
import Avatar, { AvatarProps } from './Avatar'
import React from 'react'

export default {
  title: 'Shared/Avatar',
  component: Avatar,
  argTypes: {
    size: {
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
