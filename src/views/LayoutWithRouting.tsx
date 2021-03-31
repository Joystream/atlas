import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useMatch } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { ErrorBoundary } from '@sentry/react'
import { Location } from 'history'
import { ActiveUserProvider } from '@/hooks'
import { GlobalStyle } from '@/shared/components'
import { ViewerTopbar, PublishingTopbar, ViewErrorFallback, Sidenav } from '@/components'
import { HomeView, VideoView, SearchOverlayView, ChannelView, VideosView, ChannelsView, PlaygroundView } from '@/views'
import routes from '@/config/routes'
import { routingTransitions } from '@/styles/routingTransitions'
import { transitions } from '@/shared/theme'
import { RoutingState } from '@/types/routing'
import { TOP_NAVBAR_HEIGHT } from '@/shared/components/'
import { NavItemType } from '@/components/Sidenav'
import loadable from '@loadable/component'

const StudioView = loadable(() => import('./studio/StudioView'), {
  fallback: <div>Loading...</div>,
})

StudioView.displayName = 'StudioView'

const PUBLISHING_SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'my-videos',
    name: 'Videos',
    expandedName: 'My Videos',
    to: routes.studioVideos(),
  },
  {
    icon: 'my-channel',
    name: 'Channel',
    expandedName: 'My Channel',
    to: routes.studioEditChannel(),
  },
  {
    icon: 'my-uploads',
    name: 'Uploads',
    expandedName: 'My Uploads',
    to: routes.studioUploads(),
  },
]

const VIEWER_SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'home-fill',
    expandedName: 'Home',
    to: routes.index(),
  },
  {
    icon: 'videos',
    expandedName: 'Videos',
    to: routes.videos(),
  },
  {
    icon: 'channels',
    expandedName: 'Channels',
    to: routes.channels(),
  },
]

const StudioRouter = loadable(() => import('./studio/StudioRouter'), {
  fallback: <div>Loading...</div>,
})

StudioRouter.displayName = 'StudioRouter'

const routesMap = [
  { path: '*', Component: HomeView },
  { path: routes.video(), Component: VideoView },
  { path: routes.videos(), Component: VideosView },
  { path: routes.channels(), Component: ChannelsView },
  { path: routes.channel(), Component: ChannelView },
  { path: routes.playground() + '/*', Component: PlaygroundView },
  { path: routes.studio() + '/*', Component: StudioRouter },
]

const barsRoutesMap = [
  {
    path: '*',
    Component: (
      <>
        <ViewerTopbar />
        <Sidenav items={VIEWER_SIDENAVBAR_ITEMS} />
      </>
    ),
  },
  {
    path: routes.studio() + '/*',
    Component: (
      <>
        <PublishingTopbar />
        <Sidenav isStudio items={PUBLISHING_SIDENAVBAR_ITEMS} />
      </>
    ),
  },
]

const LayoutWithRouting: React.FC = () => {
  const location = useLocation() as Location<RoutingState>
  const navigate = useNavigate()
  const searchMatch = useMatch({ path: routes.search() })
  const [cachedLocation, setCachedLocation] = useState(location)

  useEffect(() => {
    if (location === cachedLocation) {
      return
    }

    setCachedLocation(location)

    if (
      cachedLocation.state?.overlaidLocation?.pathname === location.pathname ||
      location.pathname === routes.search()
    ) {
      // if exiting routing overlay, skip scroll to top
      return
    }

    // delay scroll to allow transition to finish first
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, parseInt(transitions.timings.routing))
  }, [location, cachedLocation])

  const locationState = location.state as RoutingState
  const displayedLocation = locationState?.overlaidLocation || location

  const isStudioOrPlayground =
    displayedLocation.pathname.includes('studio') || displayedLocation.pathname.includes('playground')
  return (
    <>
      <GlobalStyle additionalStyles={routingTransitions} />
      <ActiveUserProvider>
        <Routes>
          {barsRoutesMap.map(({ path, Component }) => (
            <Route key={path} path={path} element={Component} />
          ))}
        </Routes>
      </ActiveUserProvider>
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorFallback}
          onReset={() => {
            navigate('/')
          }}
        >
          <SwitchTransition>
            <CSSTransition
              // turn off transition for /studio and /playground
              timeout={isStudioOrPlayground ? 0 : parseInt(transitions.timings.routing)}
              classNames={isStudioOrPlayground ? '' : transitions.names.fadeAndSlide}
              key={displayedLocation.pathname}
            >
              <Routes location={displayedLocation}>
                {routesMap.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
              </Routes>
            </CSSTransition>
          </SwitchTransition>
          <CSSTransition
            timeout={parseInt(transitions.timings.routingSearchOverlay)}
            classNames={transitions.names.slideDown}
            in={!!searchMatch}
            unmountOnExit
            mountOnEnter
          >
            <Route path={routes.search()} element={<SearchOverlayView />} />
          </CSSTransition>
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
  position: relative;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

export default RouterWrapper
