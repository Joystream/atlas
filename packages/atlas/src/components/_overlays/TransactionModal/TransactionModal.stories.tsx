import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'

import { TransactionModal, TransactionModalProps } from './TransactionModal'

export default {
  title: 'overlays/TransactionModal',
  component: TransactionModal,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <ConfirmationModalProvider>
              <UserProvider>
                <OverlayManagerProvider>
                  <Story />
                </OverlayManagerProvider>
              </UserProvider>
            </ConfirmationModalProvider>
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta<TransactionModalProps>

const RegularTemplate: StoryFn<TransactionModalProps> = ({ ...args }) => {
  return <TransactionModal {...args} />
}
export const Regular = RegularTemplate.bind({})
