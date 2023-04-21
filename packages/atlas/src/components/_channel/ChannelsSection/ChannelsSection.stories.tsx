import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { ChannelsSection } from '@/components/_channel/ChannelsSection/ChannelsSection'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'

export default {
  title: 'Channel/ChannelsSection',
  component: ChannelsSection,
  decorators: [
    (Story) => {
      const apolloClient = new ApolloClient({ cache: new InMemoryCache() })
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              <OverlayManagerProvider>
                <OperatorsContextProvider>
                  <ConfirmationModalProvider>
                    <Story />
                  </ConfirmationModalProvider>
                </OperatorsContextProvider>
              </OverlayManagerProvider>
            </QueryClientProvider>
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta

export const Default: StoryFn = () => {
  return <ChannelsSection />
}
