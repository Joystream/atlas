import { Meta, Story } from '@storybook/react'
import React from 'react'
import ChannelCard, { ChannelCardProps } from './ChannelCard'

export default {
  title: 'Shared/ChannelCard',
  component: ChannelCard,
  argTypes: {
    avatarPhotoUrl: {
      defaultValue: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
    },
  },
} as Meta

const Template: Story<ChannelCardProps> = (args) => <ChannelCard {...args} />

export const Default = Template.bind({})
