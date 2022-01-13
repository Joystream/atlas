import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { Grid } from '@/components/Grid'
import { AssetsManager } from '@/providers/assets'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { StorageProvidersProvider } from '@/providers/storageProviders'

import { ChannelCard, ChannelCardProps } from './ChannelCard'

export default {
  title: 'channel/ChannelCard',
  component: ChannelCard,
  args: {
    id: '3',
    withFollowButton: true,
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <OverlayManagerProvider>
              <StorageProvidersProvider>
                <ConfirmationModalProvider>
                  <AssetsManager />
                  <Story />
                </ConfirmationModalProvider>
              </StorageProvidersProvider>
            </OverlayManagerProvider>
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta

const Template: Story<ChannelCardProps> = (args) => <ChannelCard {...args} />

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
