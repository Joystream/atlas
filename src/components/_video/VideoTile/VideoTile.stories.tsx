import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { PillGroup } from '@/components/Pill'
import { IconButton } from '@/components/_buttons/IconButton'
import {
  SvgActionBid,
  SvgActionJoyToken,
  SvgActionReupload,
  SvgActionTrash,
  SvgIllustrativePlay,
} from '@/components/_icons'
import { AssetsManager } from '@/providers/assets'
import { StorageProvidersProvider } from '@/providers/storageProviders'

import { VideoTile, VideoTileProps } from '.'

export default {
  title: 'video/VideoTile',
  component: VideoTile,
  argTypes: {
    direction: {
      options: ['vertical', 'horizontal'],
      control: {
        type: 'radio',
      },
    },
  },
  args: {
    thumbnailUrl: 'https://thispersondoesnotexist.com/image',
    slots: {
      bottomLeft: {
        element: (
          <PillGroup
            size="small"
            items={[
              {
                label: 'NFT',
              },
              {
                icon: <SvgActionJoyToken />,
                label: '24K tJOY',
              },
            ]}
          />
        ),
        type: 'default',
      },
      topRight: {
        element: (
          <IconButton size="small">
            <SvgActionBid />
          </IconButton>
        ),
        type: 'default',
        clickable: true,
      },
      center: {
        element: <SvgIllustrativePlay />,
        type: 'hover',
      },
    },
    channelAvatarUrl: 'https://thispersondoesnotexist.com/image',
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
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <StorageProvidersProvider>
              <AssetsManager />
              <Story />
            </StorageProvidersProvider>
          </BrowserRouter>
        </ApolloProvider>
      )
    },
  ],
} as Meta

const Template: Story<VideoTileProps> = (args) => {
  return (
    <div style={{ maxWidth: args.direction === 'horizontal' ? 'unset' : '320px' }}>
      <VideoTile {...args} />
    </div>
  )
}

export const Default = Template.bind({})
