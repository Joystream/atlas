import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { Grid } from '@/components/Grid'
import { AssetsManager } from '@/providers/assets/assets.manager'
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
      const apolloClient = createApolloClient()
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <OverlayManagerProvider>
              <OperatorsContextProvider>
                <ConfirmationModalProvider>
                  <AssetsManager />
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

const Template: Story<ChannelCardProps> = (args) => (
  <div style={{ maxWidth: 400 }}>
    <ChannelCard {...args} />
  </div>
)

export const Default = Template.bind({})

const WithinGrid: Story<ChannelCardProps> = (args) => (
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
