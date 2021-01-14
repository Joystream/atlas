import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { client } from '@/api'
import { LayoutWithRouting } from '@/components'
import { PersonalDataProvider } from '@/hooks'

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PersonalDataProvider>
        <LayoutWithRouting />
      </PersonalDataProvider>
    </ApolloProvider>
  )
}
