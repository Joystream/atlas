import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ExtrinsicStatus } from '@/joystream-lib'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user'

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
} as Meta

const RegularTemplate: Story<TransactionModalProps> = ({ ...args }) => {
  return <TransactionModal {...args} status={ExtrinsicStatus.Unsigned} />
}
export const Regular = RegularTemplate.bind({})
