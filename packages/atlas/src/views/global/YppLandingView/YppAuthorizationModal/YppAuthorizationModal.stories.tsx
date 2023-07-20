import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'

import { YppAuthorizationModal, YppAuthorizationModalProps } from './YppAuthorizationModal'

export default {
  title: 'ypp/YppAuthorizationModal',

  component: YppAuthorizationModal,
  args: {
    step: 'requirements',
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <MemoryRouter>
          <ApolloProvider client={apolloClient}>
            <OperatorsContextProvider>
              <JoystreamProvider>
                <UserProvider>
                  <ConfirmationModalProvider>
                    <Story />
                  </ConfirmationModalProvider>
                </UserProvider>
              </JoystreamProvider>
            </OperatorsContextProvider>
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
