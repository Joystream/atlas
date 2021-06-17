import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { createApolloClient } from '@/api'
import {
  ConnectionStatusProvider,
  DialogProvider,
  OverlayManagerProvider,
  SnackbarProvider,
  StorageProvidersProvider,
} from '@/hooks'

import { MainLayout } from './MainLayout'

export const App = () => {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider>
        <ConnectionStatusProvider>
          <OverlayManagerProvider>
            <StorageProvidersProvider>
              <DialogProvider>
                <MainLayout />
              </DialogProvider>
            </StorageProvidersProvider>
          </OverlayManagerProvider>
        </ConnectionStatusProvider>
      </SnackbarProvider>
    </ApolloProvider>
  )
}
