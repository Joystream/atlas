import { ApolloProvider } from '@apollo/client'
import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'

import { RankingNumberTile } from './RankingNumberTile'

import { VideoTileViewer } from '../_video/VideoTileViewer'

export default {
  title: 'other/RankingNumberTile',
  component: RankingNumberTile,
  argTypes: {
    doubleDigits: {
      control: { type: 'select', options: [true, false] },
    },
    rankingNumber: { control: { type: 'number' } },
  },
  args: {
    rankingNumber: 1,
    doubleDigits: false,
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <Story />
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta

const video = {
  '__typename': 'Video',
  'id': '10',
  'title': 'lorem',
  'description': '',
  'category': { '__typename': 'VideoCategory', 'id': '2' },
  'views': 169,
  'duration': 31,
  'createdAt': '2022-01-31T07:33:30.000Z',
  'isPublic': true,
  'isExplicit': false,
  'isFeatured': false,
  'hasMarketing': false,
  'isCensored': false,
  'language': { '__typename': 'Language', 'iso': 'en' },
  'publishedBeforeJoystream': null,
  'mediaMetadata': { '__typename': 'VideoMediaMetadata', 'id': '83655-5', 'pixelHeight': 270, 'pixelWidth': 480 },
  'media': {
    '__typename': 'StorageDataObject',
    'id': '32',
    'createdAt': '2022-01-31T07:33:30.000Z',
    'size': 1570024,
    'isAccepted': true,
    'ipfsHash': 'gW6jEurAHaB51Q8zcwd5ALsFMxNCzNbLVtapxoaR4xH4tK',
    'storageBag': { '__typename': 'StorageBag', 'id': 'dynamic:channel:4' },
    'type': { '__typename': 'DataObjectTypeVideoMedia' },
  },
  'thumbnailPhoto': {
    '__typename': 'StorageDataObject',
    'id': '33',
    'createdAt': '2022-01-31T07:33:30.000Z',
    'size': 18442,
    'isAccepted': true,
    'ipfsHash': 'gW785uTo4Kv8erY9o42g1PyzoQ8JhGHRkk7AVKTxVfmFLt',
    'storageBag': { '__typename': 'StorageBag', 'id': 'dynamic:channel:4' },
    'type': { '__typename': 'DataObjectTypeVideoThumbnail' },
  },
  'channel': {
    '__typename': 'Channel',
    'id': '4',
    'title': 'title',
    'createdAt': '2022-01-25T15:27:24.000Z',
    'views': 598,
    'follows': 25,
    'avatarPhoto': {
      '__typename': 'StorageDataObject',
      'id': '7',
      'createdAt': '2022-01-25T15:34:06.000Z',
      'size': 14542,
      'isAccepted': true,
      'ipfsHash': 'gW5STm6UM2zrw1WJeShshjNciTYrmiMt8wAqLvDLttKBSU',
      'storageBag': { '__typename': 'StorageBag', 'id': 'dynamic:channel:4' },
      'type': { '__typename': 'DataObjectTypeChannelAvatar' },
    },
  },
  'license': { '__typename': 'License', 'id': '83655-5', 'code': 1002, 'attribution': null, 'customText': null },
}

const RankingNumberTemplate: Story<{ doubleDigits: boolean; rankingNumber: number }> = ({
  doubleDigits = false,
  rankingNumber,
}) => {
  return (
    <RankingNumberTile rankingNumber={rankingNumber} doubleDigits={doubleDigits}>
      <VideoTileViewer id={video.id} />
    </RankingNumberTile>
  )
}

export const RankingNumber = RankingNumberTemplate.bind({})
