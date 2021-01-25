import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps, Router, navigate, globalHistory } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'
import { GlobalStyle } from '@/shared/components'
import { TopNavbar, ViewErrorFallback, SideNavbar } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, VideosView, ChannelsView } from '@/views'
import routes from '@/config/routes'
import { globalStyles } from '@/styles/global'
import { breakpoints, sizes } from '@/shared/theme'
import { NavItemType } from '@/components/SideNavbar'

const SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'home-fill',
    name: 'Home',
    to: routes.index(),
  },
  {
    icon: 'videos',
    name: 'Videos',
    to: routes.videos(),
  },
  {
    icon: 'channels',
    name: 'Channels',
    to: routes.channels(),
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
      <SideNavbar items={SIDENAVBAR_ITEMS} />
      <MainContainer>
        <Router primary={false}>
          <Route default Component={HomeView} />
          <Route path={routes.video()} Component={VideoView} />
          <Route path={routes.search()} Component={SearchView} />
          <Route path={routes.videos()} Component={VideosView} />
          <Route path={routes.channels()} Component={ChannelsView} />
          <Route path={routes.channel()} Component={ChannelView} />
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
