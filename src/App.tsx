import { ApolloProvider } from '@apollo/client'
import ls from '@livesession/sdk'
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import useHotjar from 'react-use-hotjar'

import { createApolloClient } from '@/api'
import { BUILD_ENV, readEnv } from '@/config/envs'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { DistributorsContextProvider } from '@/providers/distributors'
import { GlobalStyles } from '@/styles'

import { MainLayout } from './MainLayout'
import { AssetsManager } from './providers/assets'
import { OverlayManagerProvider } from './providers/overlayManager'
import { Snackbars } from './providers/snackbars'
import { StorageProvidersProvider } from './providers/storageProviders'

export const App = () => {
  // App doesn't accept props and doesn't contain state so should never rerender
  const apolloClient = createApolloClient()
  const { initHotjar } = useHotjar()

  useEffect(() => {
    if (BUILD_ENV === 'production') {
      // eslint-disable-next-line no-console
      initHotjar(parseInt(readEnv('HOTJAR_ID')), 6, false, console.info)
      ls.init(readEnv('LIVESESSION_ID'), { keystrokes: true })
      ls.newPageView()
    }
  }, [initHotjar])

  return (
    <>
      <GlobalStyles />
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <OverlayManagerProvider>
            <DistributorsContextProvider>
              <StorageProvidersProvider>
                <ConfirmationModalProvider>
                  <MainLayout />
                  <Snackbars />
                  <AssetsManager />
                </ConfirmationModalProvider>
              </StorageProvidersProvider>
            </DistributorsContextProvider>
          </OverlayManagerProvider>
        </BrowserRouter>
      </ApolloProvider>
    </>
  )
}
