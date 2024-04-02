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
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user/user.hooks'
import { media, transitions } from '@/styles'
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
const CuratorView = lazy(() => import('./CuratorView').then((module) => ({ default: module.CuratorView })))
const CuratorHomepage = lazy(() => import('./CuratorHomepage').then((module) => ({ default: module.CuratorHomepage })))
const VideoView = lazy(() => import('./VideoView').then((module) => ({ default: module.VideoView })))
const PortfolioView = lazy(() => import('./PortfolioView').then((module) => ({ default: module.PortfolioView })))
const ReferralsView = lazy(() =>
  import('@/views/global/ReferralsView').then((module) => ({ default: module.ReferralsView }))
)

const viewerRoutes = [
  { path: relativeRoutes.viewer.search(), element: <SearchView /> },
  { path: relativeRoutes.viewer.curatorView(), element: <CuratorView /> },
  { path: relativeRoutes.viewer.curatorHomepage(), element: <CuratorHomepage /> },
  { path: relativeRoutes.viewer.index(), element: <HomeView /> },
  { path: relativeRoutes.viewer.video(), element: <VideoView /> },
  { path: relativeRoutes.viewer.channels(), element: <ChannelsView /> },
  { path: relativeRoutes.viewer.channel(), element: <ChannelView /> },
  { path: relativeRoutes.viewer.category(), element: <CategoryView /> },
  { path: relativeRoutes.viewer.memberById(), element: <MemberView /> },
  { path: relativeRoutes.viewer.member(), element: <MemberView /> },
  { path: relativeRoutes.viewer.marketplace(), element: <MarketplaceView /> },
  ...(atlasConfig.features.ypp.googleConsoleClientId
    ? [{ path: relativeRoutes.viewer.ypp(), element: <YppLandingView /> }]
    : []),
  { path: relativeRoutes.viewer.referrals(), element: <ReferralsView /> },
]

const ENTRY_POINT_ROUTE = absoluteRoutes.viewer.index()
const SIGN_IN_ROUTE = absoluteRoutes.viewer.signin()

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
  '/referrals': 'Referrals Landing page',
}

export const ViewerLayout: FC = () => {
  const { isLoggedIn } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
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
                    path={relativeRoutes.viewer.signin()}
                    element={
                      <PrivateRoute
                        element={<HomeView />}
                        showWhen={!isLoggedIn}
                        redirectTo={location.state?.redirectTo ?? ENTRY_POINT_ROUTE}
                      />
                    }
                  />
                  <Route
                    path={relativeRoutes.viewer.memberSettings()}
                    element={
                      <PrivateRoute
                        showWhen={isLoggedIn}
                        element={<MembershipSettingsView />}
                        redirectTo={SIGN_IN_ROUTE}
                      />
                    }
                  />
                  <Route
                    path={absoluteRoutes.viewer.memberNotifications()}
                    element={
                      <PrivateRoute
                        showWhen={isLoggedIn}
                        element={<MemberNotificationsView />}
                        redirectTo={SIGN_IN_ROUTE}
                      />
                    }
                  />
                  <Route
                    path={absoluteRoutes.viewer.portfolio()}
                    element={
                      <PrivateRoute showWhen={isLoggedIn} element={<PortfolioView />} redirectTo={ENTRY_POINT_ROUTE} />
                    }
                  />
                  <Route path="*" element={<NotFoundView />} />
                </Routes>
              </Suspense>
            </CSSTransition>
          </SwitchTransition>
        </ErrorBoundary>
      </MainContainer>
      <BottomNavWrapper />
      <MiscUtils />
    </>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: var(--size-topbar-height) var(--size-global-horizontal-padding) 0;
  margin-left: var(--size-sidenav-width-collapsed);
  height: 100%;

  ${media.md} {
    padding: ${location.pathname === absoluteRoutes.viewer.referrals()
      ? 'var(--size-global-horizontal-padding)'
      : 'var(--size-topbar-height) var(--size-global-horizontal-padding) 0'};
  }
`

const BottomNavWrapper = () => {
  const searchOpen = useSearchStore((state) => state.searchOpen)
  const mdMatch = useMediaMatch('md')
  if (!mdMatch && !searchOpen) {
    return <BottomNav />
  }
  return null
}

const MiscUtils = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { trackPageView } = useSegmentAnalytics()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const afterGoogleRedirect = useRef<boolean>(false)

  useEffect(() => {
    if (location.state?.['redirectTo']) {
      setAuthModalOpenName(getCorrectLoginModal())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      const [query, referrerChannel, utmSource, utmCampaign, utmContent, gState, gCode] = [
        searchParams.get('query'),
        searchParams.get('referrerId'),
        searchParams.get('utm_source'),
        searchParams.get('utm_campaign'),
        searchParams.get('utm_content'),
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
            referrerChannel: referrerChannel || undefined,
            utm_source: utmSource || undefined,
            utm_campaign: utmCampaign || undefined,
            utm_content: utmContent || undefined,
            ...(location.pathname === absoluteRoutes.viewer.search() ? { searchQuery: query } : {}),
          }),
        1000
      )

      return () => {
        clearTimeout(trackRequestTimeout)
      }
    }
  }, [location.pathname, searchParams, trackPageView])

  return null
}
