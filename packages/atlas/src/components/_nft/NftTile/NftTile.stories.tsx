import { Meta, StoryFn } from '@storybook/react'
import { BN } from 'bn.js'
import { BrowserRouter } from 'react-router-dom'

import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { NftTile, NftTileProps } from './NftTile'

export default {
  title: 'NFT/NftTile',
  component: NftTile,
  argTypes: {
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
    startsAtDate: { control: { type: 'date' } },
    auctionPlannedEndDate: { control: { type: 'date' } },
  },
  args: {
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    status: 'idle',
    startingPrice: new BN(100000000000),
    buyNowPrice: new BN(0),
    topBidAmount: new BN(123000000000),
    thumbnail: { type: 'thumbnail', thumbnailUrl: 'https://placedog.net/360/203' },
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
    owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
    duration: 120,
    views: 123456789,
    loading: false,
    fullWidth: false,
    canPutOnSale: false,
    canCancelSale: false,
    canBuyNow: false,
    canMakeBid: false,
    englishTimerState: null,
  },
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <ConfirmationModalProvider>
            <Story />
          </ConfirmationModalProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta<NftTileProps>

const Template: StoryFn<NftTileProps> = (args) => <NftTile {...args} />

export const Default = Template.bind({})
