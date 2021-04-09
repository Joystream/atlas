import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { createApolloClient } from '@/api'
import { ConnectionStatusProvider, OverlayManagerProvider } from '@/hooks'
import MainLayout from './MainLayout'

export default function App() {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <ConnectionStatusProvider>
        <OverlayManagerProvider>
          <MainLayout />
        </OverlayManagerProvider>
      </ConnectionStatusProvider>
    </ApolloProvider>
  )
}
