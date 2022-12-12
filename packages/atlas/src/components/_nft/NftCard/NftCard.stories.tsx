import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { NftCard, NftCardProps } from './NftCard'

export default {
  title: 'NFT/NftCard',
  component: NftCard,
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
    fullWidth: { type: 'boolean', defaultValue: false },
  },
  args: {
    thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
    supporters: [
      { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
      { assetUrl: 'https://placedog.net/100/100?random=3', name: 'Sue' },
      { assetUrl: 'https://placedog.net/100/100?random=4', name: 'Morgan' },
      { assetUrl: 'https://placedog.net/100/100?random=5', name: 'Jeff' },
      { assetUrl: 'https://placedog.net/100/100?random=6', name: 'Alan' },
      { assetUrl: 'https://placedog.net/100/100?random=7', name: 'Marietta' },
    ],
    owner: { assetUrl: 'https://placedog.net/100/100?random=8', name: 'John' },
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

const Template: StoryFn<NftCardProps> = (args) => <NftCard {...args} />

export const Default = Template.bind({})
export const NoSupporters = Template.bind({})

NoSupporters.args = {
  supporters: undefined,
}
