import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { createApolloClient } from '@/api'
import { AssetsManager } from '@/providers/assets'
import { StorageProvidersProvider } from '@/providers/storageProviders'

import { VideoTile, VideoTileProps } from '.'

export default {
  title: 'video/VideoTile_new',
  component: VideoTile,
  argTypes: {
    direction: {
      options: ['vertical', 'horizontal'],
      control: {
        type: 'radio',
      },
    },
    // isAnyVideoSelected: { table: { disable: true } },
    // onSelectClick: { table: { disable: true } },
    // videoPublishState: { table: { disable: true } },
    // contextMenuCallbacks: { table: { disable: true } },
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <ApolloProvider client={apolloClient}>
          <StorageProvidersProvider>
            <AssetsManager />
            <Story />
          </StorageProvidersProvider>
        </ApolloProvider>
      )
    },
  ],
} as Meta

const Template: Story<VideoTileProps> = (args) => {
  return <VideoTile {...args} />
}

export const Default = Template.bind({})
