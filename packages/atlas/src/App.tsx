import { ParallaxProvider } from 'react-scroll-parallax'

import { AnalyticsManager } from '@/AnalyticsManager'
import { CommonProviders } from '@/CommonProviders'
import { SignInModal } from '@/components/_auth/SignInModal'
import { JoystreamManager } from '@/providers/joystream/joystream.manager'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { NftActionsProvider } from '@/providers/nftActions/nftActions.provider'
import { NotificationsManager } from '@/providers/notifications/notifications.manager'
import { Snackbars } from '@/providers/snackbars'
import { TransactionsManager } from '@/providers/transactions/transactions.manager'
import { NftPurchaseBottomDrawer } from '@/views/global/NftPurchaseBottomDrawer'
import { NftSaleBottomDrawer } from '@/views/global/NftSaleBottomDrawer'
import { NftSettlementBottomDrawer } from '@/views/global/NftSettlementBottomDrawer'

import { MainLayout } from './MainLayout'

export const App = () => {
  return (
    <JoystreamProvider>
      <CommonProviders>
        <ParallaxProvider>
          <AnalyticsManager />
          <NftActionsProvider>
            <MainLayout />
            <Snackbars />
            <TransactionsManager />
            <JoystreamManager />
            <NotificationsManager />
            <SignInModal />
            <NftSettlementBottomDrawer />
            <NftPurchaseBottomDrawer />
            <NftSaleBottomDrawer />
          </NftActionsProvider>
        </ParallaxProvider>
      </CommonProviders>
    </JoystreamProvider>
  )
}
