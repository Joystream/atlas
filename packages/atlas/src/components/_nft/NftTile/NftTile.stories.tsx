import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { NftTile, NftTileProps } from '.'

export default {
  title: 'NFT/Tile',
  component: NftTile,
  argTypes: {
    title: {
      type: 'string',
    },
    thumbnail: {
      thumbnailUrl: {
        type: 'string',
      },
    },
    creator: { table: { disable: true } },
    supporters: { table: { disable: true } },
    owner: { table: { disable: true } },
  },
  args: {
    role: 'owner',
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    nftStatus: 'none',
    startingPrice: 1234,
    buyNowPrice: 0,
    topBid: 123,
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

const Template: Story<NftTileProps> = (args) => <NftTile {...args} />

export const Default = Template.bind({})
