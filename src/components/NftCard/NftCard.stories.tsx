import { Meta, Story } from '@storybook/react'
import React from 'react'

import { NftCard, NftCardProps } from './NftCard'

export default {
  title: 'other/NFT Card',
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
  },
  args: {
    thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
    creator: { assetUrl: 'https://placedog.net/100/100?random=1', tooltipText: 'Jane' },
    supporters: [
      { assetUrl: 'https://placedog.net/100/100?random=2', tooltipText: 'Kate' },
      { assetUrl: 'https://placedog.net/100/100?random=3', tooltipText: 'Sue' },
      { assetUrl: 'https://placedog.net/100/100?random=4', tooltipText: 'Morgan' },
      { assetUrl: 'https://placedog.net/100/100?random=5', tooltipText: 'Jeff' },
      { assetUrl: 'https://placedog.net/100/100?random=6', tooltipText: 'Alan' },
      { assetUrl: 'https://placedog.net/100/100?random=7', tooltipText: 'Marietta' },
    ],
    owner: { assetUrl: 'https://placedog.net/100/100?random=8', tooltipText: 'John' },
  },
} as Meta

const Template: Story<NftCardProps> = (args) => (
  <div style={{ width: '360px' }}>
    <NftCard {...args} />
  </div>
)

export const Default = Template.bind({})
