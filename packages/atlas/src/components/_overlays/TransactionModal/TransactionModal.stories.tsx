import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ExtrinsicStatus } from '@/joystream-lib/types'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'

import { TransactionModal, TransactionModalProps } from './TransactionModal'

export default {
  title: 'overlays/TransactionModal',
  component: TransactionModal,
  argTypes: {
    status: {
      defaultValue: ExtrinsicStatus.ProcessingAssets,
      control: {
        options: Object.values(ExtrinsicStatus),
        type: 'select',
        labels: {
          [ExtrinsicStatus.ProcessingAssets]: 'ProcessingAssets',
          [ExtrinsicStatus.Unsigned]: 'Unsigned',
          [ExtrinsicStatus.Syncing]: 'Syncing',
          [ExtrinsicStatus.Signed]: 'Signed',
          [ExtrinsicStatus.Error]: 'Error',
          [ExtrinsicStatus.Completed]: 'Completed',
        },
      },
    },
  },
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

const RegularTemplate: Story<TransactionModalProps> = ({ ...args }) => {
  return <TransactionModal {...args} />
}
export const Regular = RegularTemplate.bind({})
