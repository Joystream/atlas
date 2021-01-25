import React, { useEffect } from 'react'
import styled from '@emotion/styled'
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
=======
import { RouteComponentProps, Router, navigate, globalHistory, Location } from '@reach/router'
>>>>>>> d6cbe39 (add routing transition to layoutWithRouting, add slide transitions in theme)
import { ErrorBoundary } from '@sentry/react'
import { GlobalStyle, SideNavbar } from '@/shared/components'
import { TopNavbar, ViewErrorFallback, SideNavbar } from '@/components'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { HomeView, VideoView, SearchView, ChannelView, VideosView, ChannelsView } from '@/views'
import routes from '@/config/routes'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { globalStyles } from '@/styles/global'
<<<<<<< HEAD
import { breakpoints } from '@/shared/theme'
import { NavItemType, SIDENAVBAR_WIDTH } from '@/components/SideNavbar'
=======
import { breakpoints, sizes, breakpoints, sizes, transitions } from '@/shared/theme'
import { NavItemType } from '@/components/SideNavbar'
import { routingTransitions } from '@/styles/transitions'

import { NavItemType } from '../shared/components/SideNavbar'
>>>>>>> d6cbe39 (add routing transition to layoutWithRouting, add slide transitions in theme)

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
<<<<<<< HEAD
      <GlobalStyle additionalStyles={globalStyles} />
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
=======
      <GlobalStyle additionalStyles={[globalStyles, routingTransitions]} />
      <TopNavbar default />
      <SideNavbar items={SIDENAVBAR_ITEMS} />
      <MainContainer>
        <Location>
          {({ location }) => (
            <TransitionGroup>
              <CSSTransition
                timeout={parseInt(transitions.timings.regular)}
                classNames={transitions.names.fadeAndSlide}
                key={location.key}
              >
                <Router primary={false} location={location}>
                  <Route default Component={HomeView} />
                  <Route path={routes.video()} Component={VideoView} />
                  <Route path={routes.search()} Component={SearchView} />
                  <Route path={routes.videos()} Component={VideosView} />
                  <Route path={routes.channels()} Component={ChannelsView} />
                  <Route path={routes.channel()} Component={ChannelView} />
                </Router>
              </CSSTransition>
            </TransitionGroup>
          )}
        </Location>
>>>>>>> d6cbe39 (add routing transition to layoutWithRouting, add slide transitions in theme)
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
  margin-top: ${TOP_NAVBAR_HEIGHT}px;
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${SIDENAVBAR_WIDTH}px;
  }
`
export default RouterWrapper
