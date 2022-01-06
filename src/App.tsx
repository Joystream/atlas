import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AnalyticsManager } from '@/AnalyticsManager'
import { createApolloClient } from '@/api'
import { OperatorsContextProvider } from '@/providers/assets'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { GlobalStyles } from '@/styles'

import { MainLayout } from './MainLayout'
import { SignInStepsStepper } from './components/_auth/SignInSteps'
import { AssetsManager } from './providers/assets'
import { JoystreamProvider } from './providers/joystream'
import { OverlayManagerProvider } from './providers/overlayManager'
import { Snackbars } from './providers/snackbars'
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
                    <MainLayout />
                    <Snackbars />
                    <AssetsManager />
                    <SignInStepsStepper />
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
