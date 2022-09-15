import { Meta, Story } from '@storybook/react'
import BN from 'bn.js'
import { BrowserRouter } from 'react-router-dom'

import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { NftTile, NftTileProps } from './NftTile'

export default {
  title: 'NFT/NftTile',
  component: NftTile,
  argTypes: {
    title: {
      type: 'string',
    },
    status: {
      options: ['idle', 'buy-now', 'auction'],
      control: { type: 'select' },
    },
    englishTimerState: {
      options: ['expired', 'running', 'upcoming', null],
      control: { type: 'select' },
    },
    thumbnail: {
      thumbnailUrl: {
        type: 'string',
      },
    },
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
    startsAtDate: { control: { type: 'date' } },
    auctionPlannedEndDate: { control: { type: 'date' } },
  },
  args: {
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    status: 'idle',
    startingPrice: 1234000,
    buyNowPrice: 1234000,
    topBidAmount: 123000,
    thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
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

const Template: Story<NftTileProps> = (args) => (
  <NftTile
    {...args}
    startingPrice={new BN(Number(args.startingPrice))}
    buyNowPrice={new BN(Number(args.buyNowPrice))}
    topBidAmount={new BN(Number(args.topBidAmount))}
  />
)

export const Default = Template.bind({})
