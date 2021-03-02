import React from 'react'
import { ApolloProvider } from '@apollo/client'

import { client } from '@/api'
import LayoutWithRouting from '@/views/LayoutWithRouting'

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LayoutWithRouting />
    </ApolloProvider>
  )
}
