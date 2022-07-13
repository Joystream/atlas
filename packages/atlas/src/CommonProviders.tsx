import { ApolloProvider } from '@apollo/client'
import { FC, PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { AssetsManager, OperatorsContextProvider } from '@/providers/assets'
import { GlobalStyles } from '@/styles'

export const CommonProviders: FC<PropsWithChildren> = ({ children }) => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <ApolloProvider client={apolloClient}>
        <OperatorsContextProvider>
          <AssetsManager />
          <BrowserRouter>{children}</BrowserRouter>
        </OperatorsContextProvider>
      </ApolloProvider>
    </>
  )
}
