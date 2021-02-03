import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { ErrorBoundary } from '@sentry/react'
import { GlobalStyle } from '@/shared/components'
import { TopNavbar, ViewErrorFallback, SideNavbar } from '@/components'
import { HomeView, VideoView, SearchView, ChannelView, VideosView, ChannelsView } from '@/views'
import routes from '@/config/routes'
import { globalStyles } from '@/styles/global'
import { routingTransitions } from '@/styles/routingTransitions'
import { breakpoints, transitions } from '@/shared/theme'
import { NavItemType, SIDENAVBAR_WIDTH } from '@/components/SideNavbar'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'

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

const routesMap = [
  { path: '*', Component: HomeView },
  { path: routes.video(), Component: VideoView },
  { path: routes.search(), Component: SearchView },
  { path: routes.videos(), Component: VideosView },
  { path: routes.channels(), Component: ChannelsView },
  { path: routes.channel(), Component: ChannelView },
]

const LayoutWithRouting: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // delay scroll to allow transition to finish first
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, parseInt(transitions.timings.regular))
  }, [location])

  return (
    <>
      <GlobalStyle additionalStyles={[globalStyles, routingTransitions]} />
      <TopNavbar />
      <SideNavbar items={SIDENAVBAR_ITEMS} />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorFallback}
          onReset={() => {
            navigate('/')
          }}
        >
          <SwitchTransition>
            <CSSTransition
              timeout={parseInt(transitions.timings.regular)}
              classNames={transitions.names.fadeAndSlide}
              key={location.key}
            >
              <Routes location={location}>
                {routesMap.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
              </Routes>
            </CSSTransition>
          </SwitchTransition>
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
  margin-top: ${TOP_NAVBAR_HEIGHT}px;
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${SIDENAVBAR_WIDTH}px;
  }
`
export default RouterWrapper
