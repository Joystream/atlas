import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps, Router, navigate, globalHistory } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'

import { GlobalStyle } from '@/shared/components'
import { Navbar, ViewErrorFallback } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, BrowseView } from '@/views'
import routes from '@/config/routes'

type RouteProps = {
  Component: React.ComponentType
} & RouteComponentProps
const Route: React.FC<RouteProps> = ({ Component, ...pathProps }) => {
  return (
    <ErrorBoundary
      fallback={ViewErrorFallback}
      onReset={() => {
        navigate('/')
      }}
    >
      <Component {...pathProps} />
    </ErrorBoundary>
  )
}

const LayoutWithRouting: React.FC = () => {
  useEffect(() => {
    const unsubscribeFromHistory = globalHistory.listen(({ action }) => {
      if (action === 'PUSH') {
        window.scrollTo(0, 0)
      }
    })
    return unsubscribeFromHistory()
  }, [])
  return (
    <>
      <GlobalStyle />
      <Navbar default />
      <MainContainer>
        <Router primary={false}>
          <Route default Component={HomeView} />
          <Route path={routes.video()} Component={VideoView} />
          <Route path={routes.search()} Component={SearchView} />
          <Route Component={BrowseView} path={routes.browse()} />
          <Route Component={ChannelView} path={routes.channel()} />
        </Router>
      </MainContainer>
    </>
  )
}

const MainContainer = styled.main`
  padding: 0 var(--global-horizontal-padding);
`
export default LayoutWithRouting
