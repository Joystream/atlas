import { ApolloProvider } from '@apollo/client'
import { FC, PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Maintenance } from '@/Maintenance'
import { createApolloClient } from '@/api'
import { useGetKillSwitch } from '@/api/hooks/admin'
import { AdminModal } from '@/components/_overlays/AdminModal'
import { AssetsManager } from '@/providers/assets/assets.manager'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'
import { GlobalStyles } from '@/styles'

export const CommonProviders: FC<PropsWithChildren> = ({ children }) => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()

  return (
    <>
      <GlobalStyles />
      <ApolloProvider client={apolloClient}>
        <UserProvider>
          <OverlayManagerProvider>
            <ConfirmationModalProvider>
              <BrowserRouter>
                <AdminModal />
                <MaintenanceWrapper>
                  <OperatorsContextProvider>
                    <AssetsManager />
                    {children}
                  </OperatorsContextProvider>
                </MaintenanceWrapper>
              </BrowserRouter>
            </ConfirmationModalProvider>
          </OverlayManagerProvider>
        </UserProvider>
      </ApolloProvider>
    </>
  )
}

const MaintenanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isKilled, wasKilledLastTime, error, loading } = useGetKillSwitch()

  if (isKilled || (error && wasKilledLastTime) || (loading && wasKilledLastTime)) {
    return <Maintenance />
  } else {
    return <>{children}</>
  }
}
