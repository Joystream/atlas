import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { GlobalStyle } from '@/shared/components/GlobalStyle'
import { routingTransitions } from '@/styles/routingTransitions'

import { MainLayout } from './MainLayout'
import { AssetsManager } from './providers/assets'
import { OverlayManagerProvider } from './providers/overlayManager'
import { Snackbars } from './providers/snackbars'
import { StorageProvidersProvider } from './providers/storageProviders'

export const App = () => {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyle additionalStyles={[routingTransitions]} />
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <OverlayManagerProvider>
            <StorageProvidersProvider>
              <ConfirmationModalProvider>
                <MainLayout />
                <Snackbars />
                <AssetsManager />
              </ConfirmationModalProvider>
            </StorageProvidersProvider>
          </OverlayManagerProvider>
        </BrowserRouter>
      </ApolloProvider>
    </>
  )
}
