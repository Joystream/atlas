import { ApolloProvider } from '@apollo/client'
import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import { add } from 'date-fns'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { JoystreamProvider } from '@/providers/joystream'
import { ActiveUserProvider } from '@/providers/user'

import { NftWidget, NftWidgetProps } from '.'

export default {
  title: 'NFT/Nft Widget',
  component: NftWidget,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium'] },
    },
    type: {
      control: { type: 'select', options: ['open', 'english'] },
    },
    status: {
      control: { type: 'select', options: ['idle', 'buy-now', 'auction'] },
    },
    englishTimerState: {
      control: { type: 'select', options: ['expired', 'running', 'upcoming'] },
    },
    nftStatus: { table: { disable: true } },
    bidFromPreviousAuction: { table: { disable: true } },
  },
  args: {
    ownerHandle: 'ye 🖤',
    ownerAvatarUri: 'https://picsum.photos/40/40',
    size: 'medium',
    status: 'idle',
    startingPrice: 15800,
    buyNowPrice: 36900,
    userBidAmount: 100,
    topBid: 15800,
    topBidderHandle: 'Swim',
    topBidderAvatarUri: 'https://picsum.photos/40/40',
    isUserTopBidder: false,
    needsSettling: false,
    lastTransactionDate: new Date(),
    lastPrice: 25900,
    canWithdrawBid: false,
    type: 'open',
    auctionPlannedEndDate: add(new Date(), {
      minutes: 110,
      seconds: 10,
    }),
    hasBidFromPreviousAuction: false,
    startsAtDate: add(new Date(), {
      minutes: 110,
      seconds: 10,
    }),
    englishTimerState: 'upcoming',
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <ConfirmationModalProvider>
              <ActiveUserProvider>
                <JoystreamProvider>
                  <Story />
                </JoystreamProvider>
              </ActiveUserProvider>
            </ConfirmationModalProvider>
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta

// worth typing?
const Template: Story<NftWidgetProps & { size: 'medium' | 'small' } & { [key: string]: never }> = ({
  size,
  hasBidFromPreviousAuction,
  ...others
}) => (
  <Container data-size={size}>
    <NftWidget
      {...others}
      nftStatus={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(others as any),
        bidFromPreviousAuction: hasBidFromPreviousAuction ? {} : undefined,
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
