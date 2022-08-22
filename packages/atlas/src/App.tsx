import { AnalyticsManager } from '@/AnalyticsManager'
import { CommonProviders } from '@/CommonProviders'
import { SignInModal } from '@/components/_auth/SignInModal'
import { NftActionsProvider } from '@/providers/nftActions'
import { NotificationsManager } from '@/providers/notifications'
import { NftPurchaseBottomDrawer } from '@/views/global/NftPurchaseBottomDrawer'
import { NftSaleBottomDrawer } from '@/views/global/NftSaleBottomDrawer'
import { NftSettlementBottomDrawer } from '@/views/global/NftSettlementBottomDrawer'

import { MainLayout } from './MainLayout'
import { JoystreamManager, JoystreamProvider } from './providers/joystream'
import { Snackbars } from './providers/snackbars'
import { TransactionsManager } from './providers/transactions'

export const App = () => {
  return (
    <JoystreamProvider>
      <CommonProviders>
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
      </CommonProviders>
    </JoystreamProvider>
  )
}
