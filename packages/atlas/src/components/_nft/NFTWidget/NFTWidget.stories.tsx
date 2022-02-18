import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import { add } from 'date-fns'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { NFTWidget, NFTWidgetProps } from '.'

export default {
  title: 'NFT/NFT Widget',
  component: NFTWidget,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium'] },
    },
  },
  args: {
    ownerHandle: 'ye 🖤',
    ownerAvatarUri: 'https://54.172.37.177.nip.io/distributor-1/api/v1/assets/3',
    auctionEndDate: add(new Date(), {
      minutes: 110,
      seconds: 10,
    }),
    auction: 'none',
    size: 'medium',
    buyNowPrice: 36900,
    minBid: 15800,
    topBid: 15800,
    lastTransactionDate: new Date(),
    lastPrice: 25900,
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

const Template: Story<NFTWidgetProps & { size: 'medium' | 'small' }> = (args) => (
  <Container data-size={args.size}>
    <NFTWidget {...args} />
  </Container>
)

export const Default = Template.bind({})

const Container = styled.div<{ 'data-size': 'medium' | 'small' }>`
  width: 420px;

  &[data-size='small'] {
    width: 279px;
  }
`
