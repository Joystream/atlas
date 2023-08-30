import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { HoldersWidget, HoldersWidgetProps } from '@/components/_crt/HoldersWidget/HoldersWidget'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export default {
  title: 'crt/HoldersWidget',
  component: HoldersWidget,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
              <OverlayManagerProvider>
                <OperatorsContextProvider>
                  <JoystreamProvider>
                    <Story />
                  </JoystreamProvider>
                </OperatorsContextProvider>
              </OverlayManagerProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </MemoryRouter>
      )
    },
  ],
} as Meta<HoldersWidgetProps>

const Template: StoryFn<HoldersWidgetProps> = (args) => <HoldersWidget {...args} />

export const Default = Template.bind({})
