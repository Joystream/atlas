import { AllChannelFieldsFragment } from '@/api/queries'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Button } from '..'
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
} as Meta

const Template: Story<ChannelCoverProps> = (args) => {
  return (
    <>
      <ChannelCover {...args} />
      <h3>The content will show up here</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum consequuntur, consequatur in eaque ipsum labore
        perferendis quisquam voluptates, rerum quaerat quis sed velit incidunt unde assumenda facere fugit. Sit, cum?
      </p>
    </>
  )
}

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
