import { Meta, Story } from '@storybook/react'
import React from 'react'

import { VideoTileDetails, VideoTileDetailsProps } from '.'

export default {
  title: 'video/VideoTileDetails',
  component: VideoTileDetails,
  args: {
    video: {
      title: 'Example video',
      views: 20000,
      createdAt: new Date(Date.now() - 30000),
      id: '4300',
      channel: {
        title: 'Channel title',
      },
    },
  },
} as Meta<VideoTileDetailsProps>

const Template: Story<VideoTileDetailsProps> = (args) => <VideoTileDetails {...args} />

export const Default = Template.bind({})
