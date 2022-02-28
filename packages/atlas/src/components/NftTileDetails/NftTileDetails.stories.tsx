import { Meta, Story } from '@storybook/react'
import React from 'react'

import { NftTileDetails, NftTileDetailsProps } from './NftTileDetails'

export default {
  title: 'NFT/Tile Details',
  component: NftTileDetails,
  argTypes: {
    title: {
      type: 'string',
    },
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
  },
  args: {
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    role: 'owner',
    bid: 1234,
    auction: 'none',
    minBid: 1234,
    topBid: 123,
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
    owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
    loading: false,
  },
} as Meta

const Template: Story<NftTileDetailsProps> = (args) => (
  <div style={{ width: '320px' }}>
    <NftTileDetails {...args} />
  </div>
)

export const Default = Template.bind({})
