import { AllChannelFieldsFragment } from '@/api/queries'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import ChannelCover, { ChannelCoverProps } from './ChannelCover'

const channel: AllChannelFieldsFragment = {
  __typename: 'Channel',
  id: 'af8e1acc-cec4-4b3f-962f-22899f9bb617',
  handle: 'modi sequi',
  avatarPhotoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
  coverPhotoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
  follows: 20,
}

export default {
  title: 'Shared/ChannelCover',
  component: ChannelCover,
  argTypes: {
    editable: {
      defaultValue: true,
      table: {
        required: false,
      },
    },
    handleFollow: { action: 'followed' },
    channel: {
      defaultValue: {
        ...channel,
      },
    },
  },
  decorators: [(story) => <div style={{ marginLeft: '-15px', padding: '-10px' }}>{story()}</div>],
} as Meta

const Template: Story<ChannelCoverProps> = (args) => <ChannelCover {...args} />

export const Default = Template.bind({})

export const WithNoImages = Template.bind({})
WithNoImages.args = {
  channel: {
    ...channel,
    avatarPhotoUrl: null,
    coverPhotoUrl: null,
  },
}

export const WithNoFollowButton = Template.bind({})
WithNoFollowButton.args = {
  handleFollow: undefined,
}
