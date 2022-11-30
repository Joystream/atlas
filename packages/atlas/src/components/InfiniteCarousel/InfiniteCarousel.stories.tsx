import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { InfiniteCarousel, InfiniteCarouselProps } from './InfiniteCarousel'

import { ChannelCard } from '../_channel/ChannelCard'

const channelCards = [
  <ChannelCard
    key={0}
    channel={{
      title: 'jane0',
      id: '0',
      follows: 10,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={1}
    channel={{
      title: 'john1',
      id: '1',
      follows: 11,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={2}
    channel={{
      title: 'jack2',
      id: '2',
      follows: 12,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={3}
    channel={{
      title: 'bill3',
      id: '3',
      follows: 13,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={0}
    channel={{
      title: 'jane0',
      id: '0',
      follows: 10,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={1}
    channel={{
      title: 'john1',
      id: '1',
      follows: 11,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={2}
    channel={{
      title: 'jack2',
      id: '2',
      follows: 12,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
  <ChannelCard
    key={3}
    channel={{
      title: 'bill3',
      id: '3',
      follows: 13,
      createdAt: new Date(),
      channelStateBloatBond: '',
      rewardAccount: 'dummy',
    }}
  />,
]

export default {
  title: 'other/InfiniteCarousel',
  args: {
    items: channelCards,
    itemWidth: 200,
  },
  component: InfiniteCarousel,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <MemoryRouter>
          <ApolloProvider client={apolloClient}>
            <ConfirmationModalProvider>
              <Story />
            </ConfirmationModalProvider>
          </ApolloProvider>
        </MemoryRouter>
      )
    },
  ],
} as Meta<InfiniteCarouselProps>

const Template: Story<InfiniteCarouselProps> = (args) => <InfiniteCarousel {...args} />

export const Default = Template.bind({})
