import React, { useState } from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'

import {
  CreateEditChannelView,
  EditVideoSheet,
  MyUploadsView,
  MyVideosView,
  SignInView,
  SignInJoinView,
  CreateMemberView,
} from '.'
import {
  JoystreamProvider,
  ActiveUserProvider,
  DraftsProvider,
  PersonalDataProvider,
  SnackbarProvider,
  EditVideoSheetProvider,
  useVideoEditSheetRouting,
  useConnectionStatus,
  useActiveUser,
  useJoystream,
} from '@/hooks'

import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import {
  ViewErrorFallback,
  StudioTopbar,
  StudioSidenav,
  NoConnectionIndicator,
  TOP_NAVBAR_HEIGHT,
  StudioEntrypoint,
  PrivateRoute,
  StudioLoading,
} from '@/components'

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()

const StudioLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const displayedLocation = useVideoEditSheetRouting()
  const { isUserConnectedToInternet, nodeConnectionStatus } = useConnectionStatus()
  const { extensionConnected: extensionStatus } = useJoystream()

  const {
    activeUser: { accountId, memberId, channelId },
    loading: activeUserLoading,
  } = useActiveUser()

  const [enterLocation] = useState(location.pathname)
  const extensionConnectionLoading = extensionStatus === null
  const extensionConnected = extensionStatus === true

  const accountSet = !!accountId && extensionConnected
  const memberSet = accountSet && !!memberId
  const channelSet = memberSet && !!channelId

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because DismissibleMessage in video drafts depends on it

  return (
    <>
      <NoConnectionIndicator
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={isUserConnectedToInternet}
      />
      <StudioTopbar hideChannelInfo={!channelSet} />
      {channelSet && <StudioSidenav />}
      {extensionConnectionLoading || activeUserLoading ? (
        <StudioLoading />
      ) : (
        <>
          <MainContainer>
            <ErrorBoundary
              fallback={ViewErrorFallback}
              onReset={() => {
                navigate(absoluteRoutes.studio.index())
              }}
            >
              <Routes location={displayedLocation}>
                <Route
                  path={relativeRoutes.studio.index()}
                  element={<StudioEntrypoint enterLocation={enterLocation} />}
                />
                <PrivateRoute
                  path={relativeRoutes.studio.signIn()}
                  element={<SignInView />}
                  isAuth={!memberSet && accountSet}
                  redirectTo={ENTRY_POINT_ROUTE}
                />
                <PrivateRoute
                  path={relativeRoutes.studio.signInJoin()}
                  element={<SignInJoinView />}
                  isAuth={!memberSet && !accountSet}
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
                  isAuth={!memberSet && accountSet}
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
            </ErrorBoundary>
          </MainContainer>
          <EditVideoSheet />
        </>
      )}
    </>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

const StudioLayoutWrapper: React.FC = () => (
  <EditVideoSheetProvider>
    <SnackbarProvider>
      <DraftsProvider>
        <PersonalDataProvider>
          <ActiveUserProvider>
            <JoystreamProvider>
              <StudioLayout />
            </JoystreamProvider>
          </ActiveUserProvider>
        </PersonalDataProvider>
      </DraftsProvider>
    </SnackbarProvider>
  </EditVideoSheetProvider>
)

export default StudioLayoutWrapper
