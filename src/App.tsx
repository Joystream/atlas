import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { createApolloClient } from '@/api'
import { ConnectionStatusProvider, OverlayManagerProvider, SnackbarProvider } from '@/hooks'
import MainLayout from './MainLayout'
import { StoreProvider } from './hooks/useStore'

export default function App() {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider>
        <ConnectionStatusProvider>
          <OverlayManagerProvider>
            <StoreProvider>
              <MainLayout />
            </StoreProvider>
          </OverlayManagerProvider>
        </ConnectionStatusProvider>
      </SnackbarProvider>
    </ApolloProvider>
  )
}
