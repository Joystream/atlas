import { ApolloProvider } from '@apollo/client'
import { FC, PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { useGetCurrentAccountLazyQuery } from '@/api/queries/__generated__/accounts.generated'
import { absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { handleAnonymousAuth } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { SegmentAnalyticsProvider } from '@/providers/segmentAnalytics/segment.provider'
import { GlobalStyles } from '@/styles'
import { EmbeddedView } from '@/views/viewer/EmbeddedView'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const AnonymousEmbeddedProvider = ({ children }: PropsWithChildren) => {
  const [lazyCurrentAccountQuery] = useGetCurrentAccountLazyQuery()
  const {
    anonymousUserId,
    actions: { setAnonymousUserId },
  } = useAuthStore()
  useMountEffect(() => {
    const init = async () => {
      const { data } = await lazyCurrentAccountQuery()
      if (!data) {
        handleAnonymousAuth(anonymousUserId).then((userId) => {
          setAnonymousUserId(userId ?? null)
        })
        return
      }
    }
    init()
  })

  return <>{children}</>
}

export const EmbeddedCommonProviders: FC<PropsWithChildren> = ({ children }) => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <SegmentAnalyticsProvider>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <AnonymousEmbeddedProvider>
              <ConfirmationModalProvider>
                <BrowserRouter>
                  <OperatorsContextProvider>{children}</OperatorsContextProvider>
                </BrowserRouter>
              </ConfirmationModalProvider>
            </AnonymousEmbeddedProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </SegmentAnalyticsProvider>
    </>
  )
}

export const App = () => {
  return (
    <EmbeddedCommonProviders>
      <Routes>
        <Route path={absoluteRoutes.embedded.video()} element={<EmbeddedView />} />
      </Routes>
    </EmbeddedCommonProviders>
  )
}
