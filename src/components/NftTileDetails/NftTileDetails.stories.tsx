import { Meta, Story } from '@storybook/react'
import React from 'react'

import { NftTileDetails, NftTileDetailsProps } from './NftTileDetails'

export default {
  title: 'NFT/Tile Details',
  component: NftTileDetails,
  argTypes: {
    title: {
      type: 'string',
      defaultValue: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    },
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
    auction: { control: { type: 'select', options: ['none', 'minBid', 'topBid', 'waiting'] }, defaultValue: 'none' },
    role: { control: { type: 'radio', options: ['owner', 'viewer'] }, defaultValue: 'owner' },
  },
  args: {
    buyNow: false,
    bid: 1234,
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
