import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { NftTile, NftTileProps } from './NftTile'

export default {
  title: 'NFT/Tile',
  component: NftTile,
  argTypes: {
    title: {
      type: 'string',
      defaultValue: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    },
    thumbnail: {
      thumbnailUrl: {
        type: 'string',
      },
    },
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
    auction: { control: { type: 'select', options: ['none', 'minBid', 'topBid', 'waiting'] }, defaultValue: 'none' },
    role: { control: { type: 'radio', options: ['owner', 'viewer'] }, defaultValue: 'owner' },
    timeLeft: { type: 'number' },
  },
  args: {
    buyNow: false,
    bid: 1234,
    minBid: 1234,
    topBid: 123,
    thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
    owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
    duration: 120,
    views: 123456789,
    loading: false,
    fullWidth: false,
  },
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      )
    },
  ],
} as Meta

const Template: Story<NftTileProps> = (args) => <NftTile {...args} />

export const Default = Template.bind({})
