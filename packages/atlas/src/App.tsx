import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AnalyticsManager } from '@/AnalyticsManager'
import { createApolloClient } from '@/api'
import { OperatorsContextProvider } from '@/providers/assets'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { NftActionsProvider } from '@/providers/nftActions'
import { NftDialogsProvider } from '@/providers/nftDialogs'
import { GlobalStyles } from '@/styles'
import { NftSaleBottomDrawer } from '@/views/global/NftSaleBottomDrawer'
import { NftSettlementBottomDrawer } from '@/views/global/NftSettlementBottomDrawer'
import { NftPurchaseView } from '@/views/viewer/NftPurchaseView'

import { MainLayout } from './MainLayout'
import { SignInStepsStepper } from './components/_auth/SignInSteps'
import { AssetsManager } from './providers/assets'
import { JoystreamProvider } from './providers/joystream'
import { OverlayManagerProvider } from './providers/overlayManager'
import { Snackbars } from './providers/snackbars'
import { TransactionManager } from './providers/transactionManager'
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
                    <NftDialogsProvider>
                      <NftActionsProvider>
                        <MainLayout />
                        <Snackbars />
                        <AssetsManager />
                        <TransactionManager />
                        <SignInStepsStepper />
                        <NftPurchaseView />
                        <NftSettlementBottomDrawer />
                        <NftSaleBottomDrawer />
                      </NftActionsProvider>
                    </NftDialogsProvider>
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
