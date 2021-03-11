import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { createApolloClient } from '@/api'
import LayoutWithRouting from '@/views/LayoutWithRouting'
import { PersonalDataProvider, OverlayManagerProvider } from '@/hooks'

export default function App() {
  // create client on render so the mocking setup is done if needed
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <PersonalDataProvider>
        <OverlayManagerProvider>
          <LayoutWithRouting />
        </OverlayManagerProvider>
      </PersonalDataProvider>
    </ApolloProvider>
  )
}
