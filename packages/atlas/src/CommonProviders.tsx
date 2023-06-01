import { ApolloProvider } from '@apollo/client'
import { FC, PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { Maintenance } from '@/Maintenance'
import { createApolloClient } from '@/api'
import { useGetKillSwitch } from '@/api/hooks/admin'
import { AdminModal } from '@/components/_overlays/AdminModal'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { AuthProvider } from '@/providers/auth/auth.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'
import { WalletProvider } from '@/providers/wallet/wallet.provider'
import { GlobalStyles } from '@/styles'

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
          <WalletProvider>
            <AuthProvider>
              <UserProvider>
                <OverlayManagerProvider>
                  <ConfirmationModalProvider>
                    <BrowserRouter>
                      <AdminModal />
                      <MaintenanceWrapper>
                        <OperatorsContextProvider>{children}</OperatorsContextProvider>
                      </MaintenanceWrapper>
                    </BrowserRouter>
                  </ConfirmationModalProvider>
                </OverlayManagerProvider>
              </UserProvider>
            </AuthProvider>
          </WalletProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  )
}

const MaintenanceWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isKilled, wasKilledLastTime, error, loading } = useGetKillSwitch({ context: { delay: 1000 } })

  if (isKilled || (error && wasKilledLastTime) || (loading && wasKilledLastTime)) {
    return <Maintenance />
  } else {
    return <>{children}</>
  }
}
