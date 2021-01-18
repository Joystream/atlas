import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps, Router, navigate, globalHistory } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'

import { GlobalStyle, Sidenav } from '@/shared/components'
import { TopNavbar, ViewErrorFallback } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, BrowseView } from '@/views'
import routes from '@/config/routes'
import { globalStyles } from '@/styles/global'
import { breakpoints, sizes } from '@/shared/theme'
import { NavItemType } from '../shared/components/Sidenav'

const SIDENAV_ITEMS: NavItemType[] = [
  {
    icon: 'home',
    iconFilled: 'home-fill',
    name: 'Home',
    to: '/',
  },
  {
    icon: 'binocular',
    iconFilled: 'binocular-fill',
    name: 'Discover',
    to: '/browse',
  },
]

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
    return unsubscribeFromHistory
  }, [])
  return (
    <>
      <GlobalStyle additionalStyles={globalStyles} />
      <TopNavbar default />
      <Sidenav items={SIDENAV_ITEMS} />
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

  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${sizes(14)};
  }
`
export default LayoutWithRouting
