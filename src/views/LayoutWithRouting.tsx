import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@sentry/react'
import { GlobalStyle } from '@/shared/components'
import { TopNavbar, ViewErrorFallback, SideNavbar } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, VideosView, ChannelsView } from '@/views'
import routes from '@/config/routes'
import { breakpoints } from '@/shared/theme'
import { NavItemType, SIDENAVBAR_WIDTH } from '@/components/SideNavbar'

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

const LayoutWithRouting: React.FC = () => {
  const pathname = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <GlobalStyle />
      <TopNavbar />
      <SideNavbar items={SIDENAVBAR_ITEMS} />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorFallback}
          onReset={() => {
            navigate('/')
          }}
        >
          <Routes>
            <Route path="*">
              <HomeView />
            </Route>
            <Route path={routes.video()}>
              <VideoView />
            </Route>
            <Route path={routes.search()}>
              <SearchView />
            </Route>
            <Route path={routes.videos()}>
              <VideosView />
            </Route>
            <Route path={routes.channels()}>
              <ChannelsView />
            </Route>
            <Route path={routes.channel()}>
              <ChannelView />
            </Route>
          </Routes>
        </ErrorBoundary>
      </MainContainer>
    </>
  )
}

const RouterWrapper = () => {
  return (
    <BrowserRouter>
      <LayoutWithRouting />
    </BrowserRouter>
  )
}

const MainContainer = styled.main`
  padding: 0 var(--global-horizontal-padding);

  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${SIDENAVBAR_WIDTH}px;
  }
`
export default RouterWrapper
