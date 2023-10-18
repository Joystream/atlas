import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { FC, Suspense, lazy, useEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { Spinner } from '@/components/_loaders/Spinner'
import { LoadingStudioContainer } from '@/components/_loaders/StudioLoading'
import { BottomNav } from '@/components/_navigation/BottomNav'
import { PrivateRoute } from '@/components/_navigation/PrivateRoute'
import { SidenavViewer } from '@/components/_navigation/SidenavViewer'
import { TopbarViewer } from '@/components/_navigation/TopbarViewer'
import { atlasConfig } from '@/config'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'

const YppLandingView = lazy(() =>
  import('@/views/global/YppLandingView').then((module) => ({ default: module.YppLandingView }))
)
const MemberNotificationsView = lazy(() =>
  import('@/views/notifications').then((module) => ({ default: module.MemberNotificationsView }))
)
const CategoryView = lazy(() => import('./CategoryView').then((module) => ({ default: module.CategoryView })))
const ChannelView = lazy(() => import('./ChannelView').then((module) => ({ default: module.ChannelView })))
const ChannelsView = lazy(() => import('./ChannelsView').then((module) => ({ default: module.ChannelsView })))
const HomeView = lazy(() => import('./HomeView').then((module) => ({ default: module.HomeView })))
const MarketplaceView = lazy(() => import('./MarketplaceView').then((module) => ({ default: module.MarketplaceView })))
const MemberView = lazy(() => import('./MemberView').then((module) => ({ default: module.MemberView })))
const MembershipSettingsView = lazy(() =>
  import('./MembershipSettingsView').then((module) => ({ default: module.MembershipSettingsView }))
)
const NotFoundView = lazy(() => import('./NotFoundView').then((module) => ({ default: module.NotFoundView })))
const SearchView = lazy(() => import('./SearchView').then((module) => ({ default: module.SearchView })))
const VideoView = lazy(() => import('./VideoView').then((module) => ({ default: module.VideoView })))

const viewerRoutes = [
  { path: relativeRoutes.viewer.search(), element: <SearchView /> },
  { path: relativeRoutes.viewer.index(), element: <HomeView /> },
  { path: relativeRoutes.viewer.video(), element: <VideoView /> },
  { path: relativeRoutes.viewer.channels(), element: <ChannelsView /> },
  { path: relativeRoutes.viewer.channel(), element: <ChannelView /> },
  { path: relativeRoutes.viewer.category(), element: <CategoryView /> },
  { path: relativeRoutes.viewer.member(), element: <MemberView /> },
  { path: relativeRoutes.viewer.marketplace(), element: <MarketplaceView /> },
  ...(atlasConfig.features.ypp.googleConsoleClientId
    ? [{ path: relativeRoutes.viewer.ypp(), element: <YppLandingView /> }]
    : []),
]

const ENTRY_POINT_ROUTE = absoluteRoutes.viewer.index()

const locationToPageName = {
  '/discover': 'Discover',
  '/category': 'Category',
  '/search': 'Search results page',
  '/channels': 'Channels',
  '/channel': 'Channel',
  '/video': 'Video',
  '/membership/edit': 'Edit membership',
  '/member/': 'Member',
  '/notifications': 'Notifications',
  '/marketplace': 'Marketplace',
  '/ypp': 'YPP landing page',
  '/ypp-dashboard': 'YPP Dashboard',
}

export const ViewerLayout: FC = () => {
  const location = useLocation()
  const locationState = location.state as RoutingState
  const { isLoggedIn } = useUser()
  const [searchParams] = useSearchParams()
  const { trackPageView } = useSegmentAnalytics()

  const navigate = useNavigate()
  const mdMatch = useMediaMatch('md')
  const searchOpen = useSearchStore((state) => state.searchOpen)
  const displayedLocation = locationState?.overlaidLocation || location
  const afterGoogleRedirect = useRef<boolean>(false)

  useEffect(() => {
    if (!location.pathname.includes('studio')) {
      const pageName =
        location.pathname === '/'
          ? 'Homepage'
          : Object.entries(locationToPageName).find(([key]) => location.pathname.includes(key))?.[1]

      //pages below will be tracked by the view components in order to include the additional params
      if (['Channel', 'Category', 'Video'].some((page) => pageName?.includes(page))) {
        return
      }
      const [query, referrerChannel, utmSource, utmCampaign, gState, gCode] = [
        searchParams.get('query'),
        searchParams.get('referrerId'),
        searchParams.get('utm_source'),
        searchParams.get('utm_campaign'),
        searchParams.get('state'),
        searchParams.get('code'),
      ]
      if (gState || gCode) {
        afterGoogleRedirect.current = true
      }

      // had to include this timeout to make sure the page title is updated
      const trackRequestTimeout = setTimeout(
        () =>
          trackPageView(pageName || 'Unknown page', {
            ...(location.pathname === absoluteRoutes.viewer.ypp()
              ? {
                  referrerChannel: referrerChannel || undefined,
                  utm_source: utmSource || undefined,
                  utm_campaign: utmCampaign || undefined,
                }
              : {}),
            ...(location.pathname === absoluteRoutes.viewer.search() ? { searchQuery: query } : {}),
          }),
        1000
      )

      return () => {
        clearTimeout(trackRequestTimeout)
      }
    }
  }, [location.pathname, searchParams, trackPageView])

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
              <Suspense
                fallback={
                  <LoadingStudioContainer>
                    <Spinner size="large" />
                  </LoadingStudioContainer>
                }
              >
                <Routes location={displayedLocation}>
                  {viewerRoutes.map((route) => (
                    <Route key={route.path} {...route} />
                  ))}
                  <Route
                    path={relativeRoutes.viewer.memberSettings()}
                    element={
                      <PrivateRoute
                        isAuth={isLoggedIn}
                        element={<MembershipSettingsView />}
                        redirectTo={ENTRY_POINT_ROUTE}
                      />
                    }
                  />
                  <Route
                    path={absoluteRoutes.viewer.memberNotifications()}
                    element={
                      <PrivateRoute
                        isAuth={isLoggedIn}
                        element={<MemberNotificationsView />}
                        redirectTo={ENTRY_POINT_ROUTE}
                      />
                    }
                  />
                  <Route path="*" element={<NotFoundView />} />
                </Routes>
              </Suspense>
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
  height: 100%;
`
