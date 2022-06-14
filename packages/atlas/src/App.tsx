import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'

import { AnalyticsManager } from '@/AnalyticsManager'
import { createApolloClient } from '@/api'
import { OperatorsContextProvider } from '@/providers/assets'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { NftActionsProvider } from '@/providers/nftActions'
import { NotificationsManager } from '@/providers/notifications'
import { GlobalStyles } from '@/styles'
import { NftPurchaseBottomDrawer } from '@/views/global/NftPurchaseBottomDrawer'
import { NftSaleBottomDrawer } from '@/views/global/NftSaleBottomDrawer'
import { NftSettlementBottomDrawer } from '@/views/global/NftSettlementBottomDrawer'

import { MainLayout } from './MainLayout'
import { SignInStepsStepper } from './components/_auth/SignInSteps'
import { AssetsManager } from './providers/assets'
import { JoystreamManager, JoystreamProvider } from './providers/joystream'
import { OverlayManagerProvider } from './providers/overlayManager'
import { Snackbars } from './providers/snackbars'
import { TransactionsManager } from './providers/transactions'
import { ActiveUserProvider } from './providers/user'

export const App = () => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <AnalyticsManager />
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <OperatorsContextProvider>
            <OverlayManagerProvider>
              <ConfirmationModalProvider>
                <ActiveUserProvider>
                  <JoystreamProvider>
                    <NftActionsProvider>
                      <MainLayout />
                      <Snackbars />
                      <AssetsManager />
                      <TransactionsManager />
                      <JoystreamManager />
                      <NotificationsManager />
                      <SignInStepsStepper />
                      <NftSettlementBottomDrawer />
                      <NftPurchaseBottomDrawer />
                      <NftSaleBottomDrawer />
                    </NftActionsProvider>
                  </JoystreamProvider>
                </ActiveUserProvider>
              </ConfirmationModalProvider>
            </OverlayManagerProvider>
          </OperatorsContextProvider>
        </BrowserRouter>
      </ApolloProvider>
    </>
  )
}
