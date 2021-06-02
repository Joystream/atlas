import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { createApolloClient } from '@/api'
import { ConnectionStatusProvider, OverlayManagerProvider, Snackbars } from '@/hooks'
import MainLayout from './MainLayout'
import { StoreProvider } from './hooks/useStore'
import { BrowserRouter } from 'react-router-dom'

export default function App() {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <ConnectionStatusProvider>
          <StoreProvider client={apolloClient}>
            <OverlayManagerProvider>
              <MainLayout />
            </OverlayManagerProvider>
            <Snackbars />
          </StoreProvider>
        </ConnectionStatusProvider>
      </ApolloProvider>
    </BrowserRouter>
  )
}
