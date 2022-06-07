import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgActionReupload, SvgActionTrash } from '@/components/_icons'

import { VideoDetailsVariant, VideoTileDetails, VideoTileDetailsProps } from '.'

export default {
  title: 'video/VideoTileDetails',
  component: VideoTileDetails,
  args: {
    channelAvatarUrl: 'https://thispersondoesnotexist.com/image',
    variant: 'withChannelNameAndAvatar',
    size: 'medium',
    loading: false,
    videoTitle:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident distinctio omnis, voluptates molestias temporibus, incidunt tenetur totam impedit sed sunt atque veritatis ratione quisquam cum sapiente molestiae in voluptatibus iusto.',
    views: 20000000,
    createdAt: new Date(Date.now() - 1000000),
    channelTitle:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident distinctio omnis, voluptates molestias temporibus, incidunt tenetur totam impedit sed sunt atque veritatis ratione quisquam cum sapiente molestiae in voluptatibus iusto',
    kebabMenuItems: [
      {
        icon: <SvgActionTrash />,
        title: 'Delete video',
      },
      {
        icon: <SvgActionReupload />,
        title: 'Reupload file',
      },
    ],
    type: 'video',
  },
  argTypes: {
    onVideoTitleClick: { table: { disable: true } },
    onChannelAvatarClick: { table: { disable: true } },
    kebabMenuItems: { table: { disable: true } },
    video: { table: { disable: true } },
    onPlaylistDetailsClick: { table: { disable: true } },
    variant: {
      options: ['withChannelNameAndAvatar', 'withChannelName', 'withoutChannel'] as VideoDetailsVariant[],
      control: {
        type: 'radio',
      },
    },
    videoHref: { type: 'string' },
    videoSubTitle: { type: 'string' },
    size: {
      options: ['medium', 'small'],
      control: {
        type: 'radio',
      },
    },
  },
} as Meta<VideoTileDetailsProps>

const Template: Story<VideoTileDetailsProps> = (args) => (
  <div style={{ maxWidth: '320px' }}>
    <VideoTileDetails {...args} />
  </div>
)

export const Default = Template.bind({})
