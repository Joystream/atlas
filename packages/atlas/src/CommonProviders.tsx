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
          <BrowserRouter>
            <MaintenanceWrapper>
              <OperatorsContextProvider>
                <AssetsManager />
                {children}
              </OperatorsContextProvider>
            </MaintenanceWrapper>
          </BrowserRouter>
        </ApolloProvider>
      </OverlayManagerProvider>
    </>
  )
}

const MaintenanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isKilled, wasKilledLastTime, error, loading } = useGetKillSwitch()

  const shouldRenderMaintenance = isKilled || (error && wasKilledLastTime) || (loading && wasKilledLastTime)
  const shouldRenderAdminModal = !loading && !error

  return (
    <>
      {shouldRenderMaintenance ? <Maintenance /> : children}
      {shouldRenderAdminModal && <AdminModal />}
    </>
  )
}
