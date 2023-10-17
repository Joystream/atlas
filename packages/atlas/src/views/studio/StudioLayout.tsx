import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { FC, Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { NoConnectionIndicator } from '@/components/NoConnectionIndicator'
import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { Spinner } from '@/components/_loaders/Spinner'
import { LoadingStudioContainer, StudioLoading } from '@/components/_loaders/StudioLoading'
import { PrivateRoute } from '@/components/_navigation/PrivateRoute'
import { SidenavStudio } from '@/components/_navigation/SidenavStudio'
import { TopbarStudio } from '@/components/_navigation/TopbarStudio'
import { atlasConfig } from '@/config'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { ConnectionStatusManager, useConnectionStatusStore } from '@/providers/connectionStatus'
import { UploadsManager } from '@/providers/uploads/uploads.manager'
import { useUser } from '@/providers/user/user.hooks'
import { VideoWorkspaceProvider, useVideoWorkspaceRouting } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'
import { isAllowedBrowser } from '@/utils/browser'

import { useGetYppSyncedChannels } from '../global/YppLandingView/useGetYppSyncedChannels'

const StudioEntrypoint = lazy(() =>
  import('@/components/StudioEntrypoint').then((module) => ({ default: module.StudioEntrypoint }))
)

const ChannelNotificationsView = lazy(() =>
  import('@/views/notifications/ChannelNotificationsView').then((module) => ({
    default: module.ChannelNotificationsView,
  }))
)
const CrtDashboard = lazy(() =>
    import('@/views/studio/CrtDashboard').then((module) => ({ default: module.CrtWelcomeView }))
)
const CrtPreviewEditView = lazy(() =>
  import('@/views/studio/CrtPreviewEditView').then((module) => ({ default: module.CrtPreviewEditView }))
)
const CrtPreviewView = lazy(() =>
  import('@/views/studio/CrtPreviewView').then((module) => ({ default: module.CrtPreviewView }))
)
const CrtWelcomeView = lazy(() =>
  import('@/views/studio/CrtWelcomeView').then((module) => ({ default: module.CrtWelcomeView }))
)
const MyChannelView = lazy(() =>
  import('@/views/studio/MyChannelView').then((module) => ({ default: module.MyChannelView }))
)
const MyPaymentsView = lazy(() =>
  import('@/views/studio/MyPaymentsView').then((module) => ({ default: module.MyPaymentsView }))
)

const MyUploadsView = lazy(() => import('./MyUploadsView').then((module) => ({ default: module.MyUploadsView })))
const MyVideosView = lazy(() => import('./MyVideosView').then((module) => ({ default: module.MyVideosView })))
const StudioWelcomeView = lazy(() =>
  import('./StudioWelcomeView').then((module) => ({ default: module.StudioWelcomeView }))
)
const VideoWorkspace = lazy(() => import('./VideoWorkspace').then((module) => ({ default: module.VideoWorkspace })))
const YppDashboard = lazy(() => import('./YppDashboard').then((module) => ({ default: module.YppDashboard })))

const NotFoundView = lazy(() => import('../viewer/NotFoundView').then((module) => ({ default: module.NotFoundView })))

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()
const SIGN_IN_ROUTE = absoluteRoutes.studio.signIn()

const locationToPageName = {
  '/channel/new': 'New channel',
  '/channel': 'Channel',
  '/videos': 'Videos',
  '/crt-welcome': 'CRT Welcome',
  '/crt-preview-edit': 'CRT Preview Edit',
  '/crt-preview': 'CRT Preview',
  'video-workspace': 'Video workspace',
  '/uploads': 'Uploads',
  '/signin': 'Sign in',
  '/notifications': 'Notifications',
  '/payments': 'Payments',
  '/ypp': 'YPP',
  '/ypp-dashboard': 'YPP Dashboard',
  '/referrals': 'Referrals',
}

const _StudioLayout = () => {
  const location = useLocation()
  const displayedLocation = useVideoWorkspaceRouting()
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { channelId, memberships, membershipsLoading, activeMembership, activeChannel } = useUser()
  const { isAuthenticating } = useAuth()
  const [openUnsupportedBrowserDialog, closeUnsupportedBrowserDialog] = useConfirmationModal()
  const [enterLocation] = useState(location.pathname)
  const isMembershipLoaded = !membershipsLoading && !isAuthenticating
  const { trackPageView } = useSegmentAnalytics()
  const hasMembership = !!memberships?.length

  const channelSet = !!(channelId && activeMembership?.channels.find((channel) => channel.id === channelId))
  const { isLoading } = useGetYppSyncedChannels()
  const isLoadingYPPData = isLoading || membershipsLoading || isAuthenticating
  const isYppSigned = !!currentChannel
  const hasToken = !!(activeChannel && activeChannel.creatorToken?.token.id)

  useLayoutEffect(() => {
    if (!isAllowedBrowser()) {
      openUnsupportedBrowserDialog({
        type: 'warning',
        title: 'Unsupported browser detected',
        description:
          'It seems the browser you are using is not fully supported by Joystream Studio. Some of the features may not be accessible. For the best experience, please use a recent version of Chrome, Firefox or Edge.',
        primaryButton: {
          text: 'I understand',
          onClick: () => {
            closeUnsupportedBrowserDialog()
          },
        },
        onExitClick: () => {
          closeUnsupportedBrowserDialog()
        },
      })
    }
  }, [closeUnsupportedBrowserDialog, openUnsupportedBrowserDialog])

  useEffect(() => {
    const pageName = Object.entries(locationToPageName).find(([key]) => location.pathname.includes(key))?.[1]

    //dashboard is tracked by the view component in order to include tabs info
    if (pageName === 'YPP Dashboard') {
      return
    }

    // had to include this timeout to make sure the page title is updated
    const trackRequestTimeout = setTimeout(() => trackPageView(`Studio - ${pageName}`, undefined), 1000)

    return () => clearTimeout(trackRequestTimeout)
  }, [location.pathname, trackPageView])

  return (
    <>
      <TopbarStudio hideChannelInfo={!hasMembership} isMembershipLoaded={isMembershipLoaded} />
      <NoConnectionIndicator
        hasSidebar={channelSet}
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={internetConnectionStatus === 'connected'}
      />
      {membershipsLoading || isAuthenticating ? (
        <StudioLoading />
      ) : (
        <>
          <CSSTransition
            in={channelSet}
            timeout={parseInt(transitions.timings.regular)}
            classNames={SLIDE_ANIMATION}
            mountOnEnter
            unmountOnExit
          >
            <StyledSidenavStudio />
          </CSSTransition>
          <MainContainer hasSidebar={channelSet}>
            <Suspense
              fallback={
                <LoadingStudioContainer>
                  <Spinner size="large" />
                </LoadingStudioContainer>
              }
            >
              <Routes location={displayedLocation}>
                <Route
                  path={relativeRoutes.studio.index()}
                  element={<StudioEntrypoint enterLocation={enterLocation} />}
                />
                <Route
                  path={relativeRoutes.studio.signIn()}
                  element={
                    <PrivateRoute
                      element={<StudioWelcomeView />}
                      showWhen={!channelSet}
                      redirectTo={location.state?.redirectTo ?? ENTRY_POINT_ROUTE}
                    />
                  }
                />
                <Route
                  path={relativeRoutes.studio.myChannel()}
                  element={
                    <PrivateRoute element={<MyChannelView />} showWhen={channelSet} redirectTo={SIGN_IN_ROUTE} />
                  }
                />
                <Route
                  path={relativeRoutes.studio.uploads()}
                  element={
                    <PrivateRoute element={<MyUploadsView />} showWhen={channelSet} redirectTo={SIGN_IN_ROUTE} />
                  }
                />
                <Route
                  path={relativeRoutes.studio.payments()}
                  element={
                    <PrivateRoute element={<MyPaymentsView />} showWhen={channelSet} redirectTo={SIGN_IN_ROUTE} />
                  }
                />
                <Route
                  path={relativeRoutes.studio.videos()}
                  element={<PrivateRoute element={<MyVideosView />} showWhen={channelSet} redirectTo={SIGN_IN_ROUTE} />}
                />
                <Route
                    path={relativeRoutes.studio.crt()}
                    element={
                      <PrivateRoute
                          isLoadingAuthData={false}
                          element={<CrtWelcomeView />}
                          isAuth={channelSet && !hasToken}
                          redirectTo={!channelSet ? ENTRY_POINT_ROUTE : absoluteRoutes.studio.crtDashboard()}
                      />
                    }
                />
                <Route
                    path={relativeRoutes.studio.crtDashboard()}
                    element={
                      <PrivateRoute
                          element={<CrtDashboard />}
                          isAuth={channelSet && hasToken}
                          redirectTo={!channelSet ? ENTRY_POINT_ROUTE : absoluteRoutes.studio.crt()}
                      />
                    }
                />
                <Route
                  path={relativeRoutes.studio.crtTokenPreview()}
                  element={
                    <PrivateRoute element={<CrtPreviewView />} showWhen={channelSet} redirectTo={SIGN_IN_ROUTE} />
                  }
                />
                <Route
                  path={relativeRoutes.studio.crtTokenPreviewEdit()}
                  element={
                    <PrivateRoute element={<CrtPreviewEditView />} showWhen={channelSet} redirectTo={SIGN_IN_ROUTE} />
                  }
                />
                <Route
                  path={relativeRoutes.studio.channelNotifications()}
                  element={
                    <PrivateRoute
                      element={<ChannelNotificationsView />}
                      showWhen={channelSet}
                      redirectTo={SIGN_IN_ROUTE}
                    />
                  }
                />
                {atlasConfig.features.ypp.googleConsoleClientId && (
                  <Route
                    path={relativeRoutes.studio.yppDashboard()}
                    element={
                      <PrivateRoute
                        isLoadingAuthData={isLoadingYPPData}
                        element={<YppDashboard />}
                        showWhen={channelSet}
                        redirectTo={SIGN_IN_ROUTE}
                      />
                    }
                  />
                )}
                <Route path="*" element={<NotFoundView />} />
              </Routes>
            </Suspense>
          </MainContainer>
          {channelSet && <VideoWorkspace />}
        </>
      )}
    </>
  )
}

_StudioLayout.displayName = 'StudioLayout'

const MainContainer = styled.main<{ hasSidebar: boolean }>`
  --size-sidenav-width: ${({ hasSidebar }) => (hasSidebar ? 'var(--size-sidenav-width-collapsed)' : 0)};

  position: relative;
  height: 100%;
  padding: var(--size-topbar-height) var(--size-global-horizontal-padding) 0;
  margin-left: var(--size-sidenav-width);
`

const SLIDE_ANIMATION = 'slide-left'

const StyledSidenavStudio = styled(SidenavStudio)`
  &.${SLIDE_ANIMATION}-enter {
    transform: translateX(-100%);
  }

  &.${SLIDE_ANIMATION}-enter-active {
    transition: transform ${transitions.timings.regular} ${transitions.routingEasing};
    transform: translateX(0%);
  }

  &.${SLIDE_ANIMATION}-exit {
    transform: translateX(0%);
  }

  &.${SLIDE_ANIMATION}-exit-active {
    transition: transform ${transitions.timings.regular} ${transitions.routingEasing};
    transform: translateX(-100%);
  }
`

export const StudioLayout: FC = () => {
  const navigate = useNavigate()
  return (
    <ErrorBoundary
      fallback={ViewErrorBoundary}
      onReset={() => {
        navigate(absoluteRoutes.studio.index())
      }}
    >
      <VideoWorkspaceProvider>
        <ConnectionStatusManager />
        <UploadsManager />
        <_StudioLayout />
      </VideoWorkspaceProvider>
    </ErrorBoundary>
  )
}
