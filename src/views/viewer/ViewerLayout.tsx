import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { Location } from 'history'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BottomNav } from '@/components/BottomNav'
import { SidenavViewer } from '@/components/SidenavViewer'
import { TopbarViewer } from '@/components/TopbarViewer'
import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchStore } from '@/providers/search'
import { transitions } from '@/shared/theme'
import { RoutingState } from '@/types/routing'
import {
  CategoryView,
  ChannelView,
  ChannelsView,
  HomeView,
  NewView,
  PopularView,
  SearchView,
  VideoView,
} from '@/views/viewer'

import { DiscoverView } from './DiscoverView/DiscoverView'

const viewerRoutes = [
  { path: relativeRoutes.viewer.search(), element: <SearchView /> },
  { path: relativeRoutes.viewer.index(), element: <HomeView /> },
  { path: relativeRoutes.viewer.popular(), element: <PopularView /> },
  { path: relativeRoutes.viewer.new(), element: <NewView /> },
  { path: relativeRoutes.viewer.discover(), element: <DiscoverView /> },
  { path: relativeRoutes.viewer.video(), element: <VideoView /> },
  { path: relativeRoutes.viewer.channels(), element: <ChannelsView /> },
  { path: relativeRoutes.viewer.channel(), element: <ChannelView /> },
  { path: relativeRoutes.viewer.category(), element: <CategoryView /> },
]

export const ViewerLayout: React.FC = () => {
  const location = useLocation() as Location<RoutingState>
  const navigate = useNavigate()
  const [cachedLocation, setCachedLocation] = useState(location)
  const mdMatch = useMediaMatch('md')
  const { searchOpen } = useSearchStore()

  useEffect(() => {
    if (location.pathname === cachedLocation.pathname) {
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
    <>
      <TopbarViewer />
      <SidenavViewer />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorBoundary}
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
        </ErrorBoundary>
      </MainContainer>
      {!mdMatch && !searchOpen && <BottomNav />}
    </>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: var(--size-topbar-height) var(--size-global-horizontal-padding) 0;
  margin-left: var(--size-sidenav-width-collapsed);
`
