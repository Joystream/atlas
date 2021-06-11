import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { createApolloClient } from '@/api'
import { ConnectionStatusProvider, OverlayManagerProvider, SnackbarProvider, StorageProvidersProvider } from '@/hooks'

import MainLayout from './MainLayout'

export default function App() {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider>
        <ConnectionStatusProvider>
          <OverlayManagerProvider>
            <StorageProvidersProvider>
              <MainLayout />
            </StorageProvidersProvider>
          </OverlayManagerProvider>
        </ConnectionStatusProvider>
      </SnackbarProvider>
    </ApolloProvider>
  )
}
