import { ApolloProvider } from '@apollo/client'
import { Meta } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { TopSellingChannelsTable } from '@/components/TopSellingChannelsTable/TopSellingChannelsTable'
import { OverlayManagerProvider } from '@/providers/overlayManager'

export default {
  title: 'other/TopSellingChannelsTable',
  component: TopSellingChannelsTable,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <ApolloProvider client={apolloClient}>
          <OverlayManagerProvider>
            <MemoryRouter>
              <Story />
            </MemoryRouter>
          </OverlayManagerProvider>
        </ApolloProvider>
      )
    },
  ],
} as Meta

const Template = () => <TopSellingChannelsTable />

export const Default = Template.bind({})
