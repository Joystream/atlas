import { ApolloProvider } from '@apollo/client'
import { FC, PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { Maintenance } from '@/Maintenance'
import { createApolloClient } from '@/api'
import { useGetKillSwitch } from '@/api/hooks/admin'
import { AdminModal } from '@/components/_overlays/AdminModal'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SegmentAnalyticsProvider } from '@/providers/segmentAnalytics/segment.provider'
import { UserProvider } from '@/providers/user/user.provider'
import { GlobalStyles } from '@/styles'

import { FORCE_MAINTENANCE } from './config/env'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const CommonProviders: FC<PropsWithChildren> = ({ children }) => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <OverlayManagerProvider>
              <SegmentAnalyticsProvider>
                <ConfirmationModalProvider>
                  <BrowserRouter>
                    <AdminModal />
                    <MaintenanceWrapper>
                      <OperatorsContextProvider>{children}</OperatorsContextProvider>
                    </MaintenanceWrapper>
                  </BrowserRouter>
                </ConfirmationModalProvider>
              </SegmentAnalyticsProvider>
            </OverlayManagerProvider>
          </UserProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  )
}

const MaintenanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const isMaintenanceForced = FORCE_MAINTENANCE === 'true'
  const { isKilled, wasKilledLastTime, error, loading } = useGetKillSwitch({
    context: { delay: 1000 },
    skip: isMaintenanceForced,
  })

  if (isKilled || (error && wasKilledLastTime) || (loading && wasKilledLastTime) || isMaintenanceForced) {
    return <Maintenance />
  } else {
    return <>{children}</>
  }
}
