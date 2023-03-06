import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

// import { createApolloClient } from '@/api'
import { Grid } from '@/components/Grid'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { ChannelCard, ChannelCardProps } from './ChannelCard'

export default {
  title: 'channel/ChannelCard',
  component: ChannelCard,
  args: {
    loading: false,
    withFollowButton: true,
    channel: {
      title: 'my channel',
      id: '3',
      follows: 4,
      avatarPhoto: {
        id: '1',
      },
      __typename: 'Channel',
    },
  },
  decorators: [
    (Story) => {
      const apolloClient = new ApolloClient({ cache: new InMemoryCache() })
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <OverlayManagerProvider>
              <OperatorsContextProvider>
                <ConfirmationModalProvider>
                  <Story />
                </ConfirmationModalProvider>
              </OperatorsContextProvider>
            </OverlayManagerProvider>
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta

const Template: StoryFn<ChannelCardProps> = (args) => (
  <div style={{ maxWidth: 400 }}>
    <ChannelCard {...args} />
  </div>
)

export const Default = Template.bind({})

const WithinGrid: StoryFn<ChannelCardProps> = (args) => (
  <Grid>
    <ChannelCard {...args} />
    <ChannelCard {...args} />
    <ChannelCard {...args} />
    <ChannelCard {...args} />
    <ChannelCard {...args} />
    <ChannelCard {...args} />
  </Grid>
)

export const InsideGrid = WithinGrid.bind({})
