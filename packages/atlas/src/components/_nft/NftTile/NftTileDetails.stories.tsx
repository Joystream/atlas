import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { NftTileDetails, NftTileDetailsProps } from '.'

export default {
  title: 'NFT/Tile Details',
  component: NftTileDetails,
  argTypes: {
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
    videoHref: '',
  },
} as Meta<NftTileDetailsProps>

const Template: StoryFn<NftTileDetailsProps> = (args) => (
  <BrowserRouter>
    <div style={{ width: '320px' }}>
      <NftTileDetails {...args} />
    </div>
  </BrowserRouter>
)

export const Default = Template.bind({})
