import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'

import { createApolloClient } from '@/api'
import { CrtDrawer, CrtDrawerProps } from '@/components/CrtDrawer/CrtDrawer'
import { AuthProvider } from '@/providers/auth/auth.provider'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'
import { WalletProvider } from '@/providers/wallet/wallet.provider'

export default {
  title: 'CRT/CrtDrawer',
  component: CrtDrawer,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()

      return (
        <JoystreamProvider>
          <WalletProvider>
            <ApolloProvider client={apolloClient}>
              <AuthProvider>
                <OverlayManagerProvider>
                  <UserProvider>
                    <Story />
                  </UserProvider>
                </OverlayManagerProvider>
              </AuthProvider>
            </ApolloProvider>
          </WalletProvider>
        </JoystreamProvider>
      )
    },
  ],
} as Meta

const SingleTemplate: StoryFn<CrtDrawerProps> = (args) => <CrtDrawer {...args} />

export const Single = SingleTemplate.bind({})
Single.args = {
  title: 'Create you channel token',
  titleLabel: 'Token',
  isOpen: true,
  onClose: () => undefined,
  steps: ['Set up token', 'Tokens summary', 'Token insurance'],
  activeStep: 2,
  actionBar: {
    primaryButton: {
      text: 'Next step',
    },
    secondaryButton: {
      text: 'Back',
    },
  },
}
