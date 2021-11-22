import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import React, { useEffect, useState } from 'react'
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
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { ConnectionStatusManager, useConnectionStatusStore } from '@/providers/connectionStatus'
import { JoystreamProvider } from '@/providers/joystream'
import { TransactionManager } from '@/providers/transactionManager'
import { UploadsManager } from '@/providers/uploadsManager'
import { ActiveUserProvider, useUser } from '@/providers/user'
import { VideoWorkspaceProvider, useVideoWorkspaceRouting } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'
import { isAllowedBrowser } from '@/utils/browser'
import {
  CreateEditChannelView,
  CreateMemberView,
  MyUploadsView,
  MyVideosView,
  SignInJoinView,
  SignInView,
  VideoWorkspace,
} from '@/views/studio'

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()

const StudioLayout = () => {
  const location = useLocation()
  const displayedLocation = useVideoWorkspaceRouting()
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { activeAccountId, activeMemberId, activeChannelId, extensionConnected, memberships, userInitialized } =
    useUser()

  const [openUnsupportedBrowserDialog, closeUnsupportedBrowserDialog] = useConfirmationModal()
  const [enterLocation] = useState(location.pathname)
  const hasMembership = !!memberships?.length

  const accountSet = !!activeAccountId && !!extensionConnected
  const memberSet = accountSet && !!activeMemberId && hasMembership
  const channelSet = memberSet && !!activeChannelId && hasMembership

  useEffect(() => {
    if (!isAllowedBrowser()) {
      openUnsupportedBrowserDialog({
        iconType: 'warning',
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

  return (
    <>
      <NoConnectionIndicator
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={internetConnectionStatus === 'connected'}
      />
      <TopbarStudio hideChannelInfo={!memberSet} />
      <CSSTransition
        in={channelSet}
        timeout={parseInt(transitions.timings.regular)}
        classNames={SLIDE_ANIMATION}
        mountOnEnter
        unmountOnExit
      >
        <StyledSidenavStudio />
      </CSSTransition>
      {!userInitialized ? (
        <StudioLoading />
      ) : (
        <>
          <MainContainer hasSidebar={channelSet}>
            <Routes location={displayedLocation}>
              <Route
                path={relativeRoutes.studio.index()}
                element={<StudioEntrypoint enterLocation={enterLocation} />}
              />
              <PrivateRoute
                path={relativeRoutes.studio.signIn()}
                element={<SignInView />}
                isAuth={hasMembership}
                redirectTo={ENTRY_POINT_ROUTE}
              />
              <PrivateRoute
                path={relativeRoutes.studio.signInJoin()}
                element={<SignInJoinView />}
                isAuth={!hasMembership}
                redirectTo={ENTRY_POINT_ROUTE}
              />
              <PrivateRoute
                path={relativeRoutes.studio.newChannel()}
                element={<CreateEditChannelView newChannel />}
                isAuth={memberSet}
                redirectTo={ENTRY_POINT_ROUTE}
              />
              <PrivateRoute
                path={relativeRoutes.studio.editChannel()}
                element={<CreateEditChannelView />}
                isAuth={channelSet}
                redirectTo={ENTRY_POINT_ROUTE}
              />
              <PrivateRoute
                path={relativeRoutes.studio.newMembership()}
                element={<CreateMemberView />}
                isAuth={accountSet && !memberSet}
                redirectTo={ENTRY_POINT_ROUTE}
              />
              <PrivateRoute
                path={relativeRoutes.studio.uploads()}
                element={<MyUploadsView />}
                isAuth={channelSet}
                redirectTo={ENTRY_POINT_ROUTE}
              />
              <PrivateRoute
                path={relativeRoutes.studio.videos()}
                element={<MyVideosView />}
                isAuth={channelSet}
                redirectTo={ENTRY_POINT_ROUTE}
              />
            </Routes>
          </MainContainer>
          {channelSet && <VideoWorkspace />}
        </>
      )}
    </>
  )
}

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

const StudioLayoutWrapper: React.FC = () => {
  const navigate = useNavigate()
  return (
    <ErrorBoundary
      fallback={ViewErrorBoundary}
      onReset={() => {
        navigate(absoluteRoutes.studio.index())
      }}
    >
      <ActiveUserProvider>
        <VideoWorkspaceProvider>
          <JoystreamProvider>
            <ConnectionStatusManager />
            <UploadsManager />
            <TransactionManager />
            <StudioLayout />
          </JoystreamProvider>
        </VideoWorkspaceProvider>
      </ActiveUserProvider>
    </ErrorBoundary>
  )
}

export default StudioLayoutWrapper
