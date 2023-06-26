import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { FC, useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { NoConnectionIndicator } from '@/components/NoConnectionIndicator'
import { StudioEntrypoint } from '@/components/StudioEntrypoint'
import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { StudioLoading } from '@/components/_loaders/StudioLoading'
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
import { NotificationsView } from '@/views/notifications'
import { CrtPreviewEditView } from '@/views/studio/CrtPreviewEditView'
import { CrtPreviewView } from '@/views/studio/CrtPreviewView'
import { CrtWelcomeView } from '@/views/studio/CrtWelcomeView/CrtWelcomeView'
import { MyChannelView } from '@/views/studio/MyChannelView'
import { MyPaymentsView } from '@/views/studio/MyPaymentsView'

import { MyUploadsView } from './MyUploadsView'
import { MyVideosView } from './MyVideosView'
import { StudioWelcomeView } from './StudioWelcomeView'
import { VideoWorkspace } from './VideoWorkspace'
import { YppDashboard } from './YppDashboard'

import { YppLandingView } from '../global/YppLandingView'
import { useGetYppSyncedChannels } from '../global/YppLandingView/YppLandingView.hooks'
import { NotFoundView } from '../viewer/NotFoundView'

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()

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
}

const StudioLayout = () => {
  const location = useLocation()
  const displayedLocation = useVideoWorkspaceRouting()
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { channelId, memberships, membershipsLoading, activeMembership } = useUser()
  const { isAuthenticating } = useAuth()

  const [openUnsupportedBrowserDialog, closeUnsupportedBrowserDialog] = useConfirmationModal()
  const [enterLocation] = useState(location.pathname)
  const isMembershipLoaded = !membershipsLoading && !isAuthenticating
  const { trackPageView } = useSegmentAnalytics()
  const hasMembership = !!memberships?.length

  const channelSet = !!(channelId && activeMembership?.channels.find((channel) => channel.id === channelId))
  const { currentChannel, isLoading } = useGetYppSyncedChannels()
  const isLoadingYPPData = isLoading || membershipsLoading || isAuthenticating
  const isYppSigned = !!currentChannel

  useEffect(() => {
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
    const pageName = Object.keys(locationToPageName).find((key) => location.pathname.includes(key))

    // had to include this timeout to make sure the page title is updated
    const trackRequestTimeout = setTimeout(() => trackPageView(`Studio - ${pageName}`, undefined), 1000)

    return () => clearTimeout(trackRequestTimeout)
  }, [location.pathname, trackPageView])

  const yppRedirect = useCallback(() => {
    if (!channelSet) {
      return ENTRY_POINT_ROUTE
    }
    if (!isYppSigned) {
      return absoluteRoutes.studio.ypp()
    }
  }, [channelSet, isYppSigned])

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
            <Routes location={displayedLocation}>
              <Route
                path={relativeRoutes.studio.index()}
                element={<StudioEntrypoint enterLocation={enterLocation} />}
              />
              <Route
                path={relativeRoutes.studio.signIn()}
                element={
                  <PrivateRoute element={<StudioWelcomeView />} isAuth={!channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.myChannel()}
                element={
                  <PrivateRoute element={<MyChannelView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.uploads()}
                element={
                  <PrivateRoute element={<MyUploadsView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.payments()}
                element={
                  <PrivateRoute element={<MyPaymentsView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.videos()}
                element={<PrivateRoute element={<MyVideosView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />}
              />
              <Route
                path={relativeRoutes.studio.crtWelcome()}
                element={
                  <PrivateRoute element={<CrtWelcomeView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.crtTokenPreview()}
                element={
                  <PrivateRoute element={<CrtPreviewView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.crtTokenPreviewEdit()}
                element={
                  <PrivateRoute element={<CrtPreviewEditView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              <Route
                path={relativeRoutes.studio.notifications()}
                element={
                  <PrivateRoute element={<NotificationsView />} isAuth={channelSet} redirectTo={ENTRY_POINT_ROUTE} />
                }
              />
              {atlasConfig.features.ypp.googleConsoleClientId && (
                <>
                  <Route
                    path={relativeRoutes.studio.ypp()}
                    element={
                      <PrivateRoute
                        isLoadingAuthData={isLoadingYPPData}
                        element={<YppLandingView />}
                        isAuth={channelSet && !isYppSigned}
                        redirectTo={absoluteRoutes.studio.yppDashboard()}
                      />
                    }
                  />
                  <Route
                    path={relativeRoutes.studio.yppDashboard()}
                    element={
                      <PrivateRoute
                        isLoadingAuthData={isLoadingYPPData}
                        element={<YppDashboard />}
                        isAuth={channelSet && isYppSigned}
                        redirectTo={yppRedirect()}
                      />
                    }
                  />
                </>
              )}
              <Route path="*" element={<NotFoundView />} />
            </Routes>
          </MainContainer>
          {channelSet && <VideoWorkspace />}
        </>
      )}
    </>
  )
}

StudioLayout.displayName = 'StudioLayout'

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

const StudioLayoutWrapper: FC = () => {
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
        <StudioLayout />
      </VideoWorkspaceProvider>
    </ErrorBoundary>
  )
}

export default StudioLayoutWrapper
