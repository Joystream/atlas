import { Meta, Story } from '@storybook/react'
import React from 'react'
import ChannelCover from './ChannelCover'

const channel = {
  id: 'af8e1acc-cec4-4b3f-962f-22899f9bb617',
  handle: 'modi sequi',
  avatarPhotoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
  coverPhotoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
}

export default {
  title: 'Shared/ChannelCover',
  component: ChannelCover,
  argTypes: {
    channel: {
      defaultValue: {
        ...channel,
      },
    },
  },
  decorators: [(story) => <div style={{ marginLeft: '-15px', padding: '-10px' }}>{story()}</div>],
} as Meta

const Template: Story = (args) => <ChannelCover {...args} />
export const Default = Template.bind({})
export const WithNoAvatar = Template.bind({})

WithNoAvatar.args = {
  channel: {
    ...channel,
    avatarPhotoUrl: null,
  },
}
