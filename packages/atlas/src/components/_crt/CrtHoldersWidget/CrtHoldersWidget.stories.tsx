import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'

import { createApolloClient } from '@/api'
import { CrtHoldersWidget, CrtHoldersWidgetProps } from '@/components/_crt/CrtHoldersWidget/CrtHoldersWidget'
import { AuthProvider } from '@/providers/auth/auth.provider'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SegmentAnalyticsProvider } from '@/providers/segmentAnalytics/segment.provider'
import { UserProvider } from '@/providers/user/user.provider'
import { WalletProvider } from '@/providers/wallet/wallet.provider'

export default {
  title: 'crt/CrtHoldersWidget',
  component: CrtHoldersWidget,
  args: {
    holders: [
      {
        value: 50,
        name: 'Bedeho',
        members: [
          {
            handle: 'Bedeho',
            avatarUrls: [],
          },
        ],
      },
      {
        value: 30,
        name: 'Dima',
        members: [
          {
            handle: 'Dima',
            avatarUrls: [],
          },
        ],
      },
      {
        name: 'Others',
        value: 20,
        members: [
          {
            handle: 'Radek',
            avatarUrls: [],
          },
          {
            handle: 'Theo',
            avatarUrls: [],
          },
        ],
      },
    ],
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()

      return (
        <JoystreamProvider>
          <SegmentAnalyticsProvider>
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
          </SegmentAnalyticsProvider>
        </JoystreamProvider>
      )
    },
  ],
} as Meta<CrtHoldersWidgetProps>

export const Default: StoryFn<CrtHoldersWidgetProps> = (args) => <CrtHoldersWidget {...args} />
