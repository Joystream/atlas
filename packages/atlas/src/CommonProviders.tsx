import { ApolloProvider } from '@apollo/client'
import { FC, PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Maintenance } from '@/Maintenance'
import { createApolloClient } from '@/api'
import { useGetKillSwitch } from '@/api/hooks/admin'
import { AdminModal } from '@/components/_overlays/AdminModal'
import { AssetsManager, OperatorsContextProvider } from '@/providers/assets'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { GlobalStyles } from '@/styles'

export const CommonProviders: FC<PropsWithChildren> = ({ children }) => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <OverlayManagerProvider>
        <ApolloProvider client={apolloClient}>
          <MaintenanceWrapper>
            <OperatorsContextProvider>
              <AssetsManager />
              <BrowserRouter>{children}</BrowserRouter>
            </OperatorsContextProvider>
          </MaintenanceWrapper>
        </ApolloProvider>
      </OverlayManagerProvider>
    </>
  )
}

const MaintenanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isKilled, wasKilledLastTime, error, loading } = useGetKillSwitch()

  return (
    <>
      {isKilled || (error && wasKilledLastTime) || (loading && wasKilledLastTime) ? (
        <>
          <Maintenance />
        </>
      ) : (
        children
      )}
      {(isKilled || (loading && wasKilledLastTime)) && !loading && !error && (
        <BrowserRouter>
          <AdminModal />
        </BrowserRouter>
      )}
    </>
  )
}
