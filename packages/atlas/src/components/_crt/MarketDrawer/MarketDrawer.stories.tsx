import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'

import { createApolloClient } from '@/api'
import { CrtMarketSaleViewProps, MarketDrawer } from '@/components/_crt/MarketDrawer'
import { AuthProvider } from '@/providers/auth/auth.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SegmentAnalyticsProvider } from '@/providers/segmentAnalytics/segment.provider'
import { UserProvider } from '@/providers/user/user.provider'
import { WalletProvider } from '@/providers/wallet/wallet.provider'

export default {
  title: 'crt/CrtMarket',
  component: MarketDrawer,
  decorators: [
    (Story) => (
      <JoystreamProvider>
        <ApolloProvider client={createApolloClient()}>
          <WalletProvider>
            <SegmentAnalyticsProvider>
              <ConfirmationModalProvider>
                <AuthProvider>
                  <UserProvider>
                    <OverlayManagerProvider>
                      <Story />
                    </OverlayManagerProvider>
                  </UserProvider>
                </AuthProvider>
              </ConfirmationModalProvider>
            </SegmentAnalyticsProvider>
          </WalletProvider>
        </ApolloProvider>
      </JoystreamProvider>
    ),
  ],
} as Meta<CrtMarketSaleViewProps>

const Template: StoryFn<CrtMarketSaleViewProps> = (args) => <MarketDrawer {...args} />

export const Default = Template.bind({})
Default.args = {
  show: true,
  onClose: () => {
    return null
  },
  tokenName: 'JBC',
}
