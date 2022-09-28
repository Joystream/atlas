import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'

import { YppAuthorizationModal, YppAuthorizationModalProps } from './YppAuthorizationModal'

export default {
  title: 'ypp/YppAuthorizationModal',

  component: YppAuthorizationModal,
  argTypes: {
    currentStepIdx: {
      type: 'number',
    },
  },
  args: {
    currentStepIdx: null,
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <MemoryRouter>
          <ApolloProvider client={apolloClient}>
            <UserProvider>
              <ConfirmationModalProvider>
                <Story />
              </ConfirmationModalProvider>
            </UserProvider>
          </ApolloProvider>
        </MemoryRouter>
      )
    },
  ],
} as Meta<YppAuthorizationModalProps>

const Template: Story<YppAuthorizationModalProps> = (args) => {
  const apolloClient = createApolloClient()
  return (
    <ApolloProvider client={apolloClient}>
      <OverlayManagerProvider>
        <YppAuthorizationModal {...args} />
      </OverlayManagerProvider>
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
