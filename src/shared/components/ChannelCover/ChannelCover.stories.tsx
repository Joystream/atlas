import { Meta, Story } from '@storybook/react'
import React from 'react'

import ChannelCover, { ChannelCoverProps } from './ChannelCover'

export default {
  title: 'Shared/C/ChannelCover',
  component: ChannelCover,
  argTypes: {
    editable: {
      table: {
        required: false,
      },
    },
    onCoverEditClick: { action: 'edit/add cover' },
    onCoverRemoveClick: { action: 'remove cover' },
    coverPhotoUrl: {
      defaultValue: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
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

export const WithNoImage = Template.bind({})
WithNoImage.args = {
  coverPhotoUrl: undefined,
}
