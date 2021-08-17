import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { GlobalStyle } from '@/shared/components'
import { routingTransitions } from '@/styles/routingTransitions'

import { MainLayout } from './MainLayout'
import { AssetsManager, DialogProvider, OverlayManagerProvider, Snackbars, StorageProvidersProvider } from './providers'

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
              <DialogProvider>
                <MainLayout />
                <Snackbars />
                <AssetsManager />
              </DialogProvider>
            </StorageProvidersProvider>
          </OverlayManagerProvider>
        </BrowserRouter>
      </ApolloProvider>
    </>
  )
}
