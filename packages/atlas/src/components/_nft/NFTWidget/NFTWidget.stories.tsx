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
    status: {
      control: { type: 'select', options: ['iddle', 'buy-now', 'auction'] },
    },
  },
  args: {
    ownerHandle: 'ye 🖤',
    ownerAvatarUri: 'https://54.172.37.177.nip.io/distributor-1/api/v1/assets/3',
    size: 'medium',
    status: 'iddle',
    startingPrice: 15800,
    buyNowPrice: 36900,
    topBid: 15800,
    lastTransactionDate: new Date(),
    lastPrice: 25900,
    isCompleted: false,
    canWithdrawBid: false,
    auctionPlannedEndDate: add(new Date(), {
      minutes: 110,
      seconds: 10,
    }),
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

// worth typing?
const Template: Story<NFTWidgetProps & { size: 'medium' | 'small' } & { [key: string]: never }> = ({
  size,
  status,
  startingPrice,
  buyNowPrice,
  topBid,
  lastTransactionDate,
  lastPrice,
  isCompleted,
  canWithdrawBid,
  auctionPlannedEndDate,
  ...others
}) => (
  <Container data-size={size}>
    <NFTWidget
      {...others}
      nftState={{
        status: status,
        startingPrice,
        buyNowPrice,
        topBid,
        lastTransactionDate,
        lastPrice,
        canWithdrawBid,
        isCompleted,
        auctionPlannedEndDate,
      }}
    />
  </Container>
)

export const Default = Template.bind({})

const Container = styled.div<{ 'data-size': 'medium' | 'small' }>`
  width: 420px;

  &[data-size='small'] {
    width: 279px;
  }
`
