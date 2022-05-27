import { Meta, Story } from '@storybook/react'

import { NftTileDetails, NftTileDetailsProps } from '.'

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
    auction: 'none',
    minBid: 1234,
    topBid: 123,
    buyNowPrice: 0,
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
    owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
    loading: false,
    canPutOnSale: false,
    canCancelSale: false,
    canBuyNow: false,
    canMakeBid: false,
  },
} as Meta

const Template: Story<NftTileDetailsProps> = (args) => (
  <div style={{ width: '320px' }}>
    <NftTileDetails {...args} />
  </div>
)

export const Default = Template.bind({})
