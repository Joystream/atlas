import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Route, Routes, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Location } from 'history'
import { ErrorBoundary } from '@sentry/react'

import { ChannelsView, ChannelView, HomeView, SearchOverlayView, VideosView, VideoView } from '.'
import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import { RoutingState } from '@/types/routing'
import { transitions } from '@/shared/theme'
import { Sidenav, NavItemType, ViewErrorFallback, ViewerTopbar, TOP_NAVBAR_HEIGHT } from '@/components'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { PersonalDataProvider } from '@/hooks'

const viewerRoutes = [
  { path: relativeRoutes.viewer.index(), element: <HomeView /> },
  { path: relativeRoutes.viewer.video(), element: <VideoView /> },
  { path: relativeRoutes.viewer.videos(), element: <VideosView /> },
  { path: relativeRoutes.viewer.channels(), element: <ChannelsView /> },
  { path: relativeRoutes.viewer.channel(), element: <ChannelView /> },
]

const viewerSidenavItems: NavItemType[] = [
  {
    icon: 'home-fill',
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
  },
  {
    icon: 'videos',
    name: 'Videos',
    to: absoluteRoutes.viewer.videos(),
  },
  {
    icon: 'channels',
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
  },
]

const ViewerLayout: React.FC = () => {
  const location = useLocation() as Location<RoutingState>
  const navigate = useNavigate()
  const searchMatch = useMatch({ path: absoluteRoutes.viewer.search() })
  const [cachedLocation, setCachedLocation] = useState(location)

  useEffect(() => {
    if (location === cachedLocation) {
      return
    }

    setCachedLocation(location)

    if (
      cachedLocation.state?.overlaidLocation?.pathname === location.pathname ||
      location.pathname === absoluteRoutes.viewer.search()
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
  return (
    <PersonalDataProvider>
      <ViewerTopbar />
      <Sidenav items={viewerSidenavItems} />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorFallback}
          onReset={() => {
            navigate(absoluteRoutes.viewer.index())
          }}
        >
          <SwitchTransition>
            <CSSTransition
              timeout={parseInt(transitions.timings.routing)}
              classNames={transitions.names.fadeAndSlide}
              key={displayedLocation.pathname}
            >
              <Routes location={displayedLocation}>
                {viewerRoutes.map((route) => (
                  <Route key={route.path} {...route} />
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
            <Route path={relativeRoutes.viewer.search()} element={<SearchOverlayView />} />
          </CSSTransition>
        </ErrorBoundary>
      </MainContainer>
    </PersonalDataProvider>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

export default ViewerLayout
