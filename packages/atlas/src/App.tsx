import { AnalyticsManager } from '@/AnalyticsManager'
import { CommonProviders } from '@/CommonProviders'
import { WelcomeDialog } from '@/components/WelcomeDialog'
import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
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
import { SignUpModal } from './components/_auth/SignUpModal'

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
          <ExternalSignInModal />
          <SignUpModal />
          <LogInModal />
          <WelcomeDialog />
          <NftSettlementBottomDrawer />
          <NftPurchaseBottomDrawer />
          <NftSaleBottomDrawer />
        </NftActionsProvider>
      </CommonProviders>
    </JoystreamProvider>
  )
}
