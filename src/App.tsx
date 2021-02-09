import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { client } from '@/api'
import LayoutWithRouting from '@/views/LayoutWithRouting'
import { PersonalDataProvider, OverlayManagerProvider } from '@/hooks'

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PersonalDataProvider>
        <OverlayManagerProvider>
          <LayoutWithRouting />
        </OverlayManagerProvider>
      </PersonalDataProvider>
    </ApolloProvider>
  )
}
