import { Meta, StoryFn } from '@storybook/react'
import BN from 'bn.js'
import { BrowserRouter } from 'react-router-dom'

import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { NftTile, NftTileProps } from './NftTile'

type StoryProps = Omit<NftTileProps, 'startingPrice' | 'buyNowPrice' | 'topBidAmount'> & {
  startingPrice: number
  buyNowPrice: number
  topBidAmount: number
}

export default {
  title: 'NFT/NftTile',
  component: NftTile,
  argTypes: {
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
    startsAtDate: { control: { type: 'date' } },
    auctionPlannedEndDate: { control: { type: 'date' } },
    startingPrice: { control: { type: 'number' } },
    buyNowPrice: { control: { type: 'number' } },
    topBidAmount: { control: { type: 'number' } },
  },
  args: {
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    status: 'idle',
    startingPrice: 12340000000,
    buyNowPrice: 123400000000,
    topBidAmount: 1600000000,
    thumbnail: { type: 'video', thumbnailUrl: 'https://placedog.net/360/203' },
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
} as Meta

const Template: StoryFn<StoryProps> = ({ startingPrice, buyNowPrice, topBidAmount, ...args }) => (
  <NftTile
    {...args}
    startingPrice={new BN(startingPrice)}
    buyNowPrice={new BN(buyNowPrice)}
    topBidAmount={new BN(topBidAmount)}
  />
)

export const Default = Template.bind({})
