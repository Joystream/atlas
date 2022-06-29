import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { VideoGallery } from '@/components/_video/VideoGallery'

export default {
  title: 'video/VideoGallery',
  component: VideoGallery,
  argTypes: {
    hasRanking: { type: 'boolean' },
  },
  args: { hasRanking: true },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </ApolloProvider>
      )
    },
  ],
} as Meta

const video = {
  '__typename': 'Video',
  'id': '25',
  'title': 'test1 ',
  'views': 102,
  'createdAt': '2022-02-11T15:22:00.000Z',
  'duration': 13,
  'isPublic': true,
  'media': {
    '__typename': 'StorageDataObject',
    'id': '69',
    'createdAt': '2022-02-11T15:22:00.000Z',
    'size': 6955284,
    'isAccepted': true,
    'ipfsHash': 'gW6m2g9driSJmePwpJ4B9B2zCwPi6skYTJ6wH5iCSW6Xk5',
    'storageBag': {
      '__typename': 'StorageBag',
      'id': 'dynamic:channel:1',
    },
    'type': {
      '__typename': 'DataObjectTypeVideoMedia',
    },
  },
  'channel': {
    '__typename': 'Channel',
    'id': '1',
    'title': 'test channel0',
    'avatarPhoto': {
      '__typename': 'StorageDataObject',
      'id': '0',
      'createdAt': '2022-01-25T12:14:12.000Z',
      'size': 4418,
      'isAccepted': true,
      'ipfsHash': 'gW7e8wYBJtHSa7qcgYbXMUYfEDC2k6jVU5GZkCuLjPVGKX',
      'storageBag': {
        '__typename': 'StorageBag',
        'id': 'dynamic:channel:1',
      },
      'type': {
        '__typename': 'DataObjectTypeChannelAvatar',
      },
    },
  },
  'thumbnailPhoto': {
    '__typename': 'StorageDataObject',
    'id': '83',
    'createdAt': '2022-02-18T11:12:54.000Z',
    'size': 69120,
    'isAccepted': true,
    'ipfsHash': 'gWDBtBvCkiNNyaL6DDJCmNzYMewXcT3koa1HbxDWjtL3zQ',
    'storageBag': {
      '__typename': 'StorageBag',
      'id': 'dynamic:channel:1',
    },
    'type': {
      '__typename': 'DataObjectTypeVideoThumbnail',
    },
  },
}

const Template: Story<{ hasRanking: boolean }> = ({ hasRanking }) => {
  return <VideoGallery hasRanking={hasRanking} videos={Array(10).fill(video)} />
}

export const Default = Template.bind({})
