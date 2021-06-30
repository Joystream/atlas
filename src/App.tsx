import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { createApolloClient } from '@/api'

import { MainLayout } from './MainLayout'
import { AssetsManager, DialogProvider, OverlayManagerProvider, Snackbars, StorageProvidersProvider } from './providers'

export const App = () => {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <OverlayManagerProvider>
        <StorageProvidersProvider>
          <DialogProvider>
            <MainLayout />
            <Snackbars />
            <AssetsManager />
          </DialogProvider>
        </StorageProvidersProvider>
      </OverlayManagerProvider>
    </ApolloProvider>
  )
}
