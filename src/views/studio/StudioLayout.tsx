import React, { useState } from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/react'
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
import { useMemberships } from '@/api/hooks'

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()

const StudioLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const displayedLocation = useVideoEditSheetRouting()
  const { isUserConnectedToInternet, nodeConnectionStatus } = useConnectionStatus()
  const { extensionConnected: extensionStatus, accounts } = useJoystream()

  const {
    activeUser: { accountId, memberId, channelId },
    loading: activeUserLoading,
  } = useActiveUser()

  const { memberships, loading: membershipsLoading } = useMemberships({
    where: { controllerAccount_in: accounts.map((a) => a.id) },
  })

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
      <StudioTopbar hideChannelInfo={!memberSet || !memberships?.length} />
      {channelSet && !!memberships?.length && <StudioSidenav />}
      {extensionConnectionLoading || activeUserLoading || membershipsLoading ? (
        <StudioLoading />
      ) : (
        <>
          <MainContainer>
            {(!channelSet || !memberSet) && <Global styles={fullWidthLayout} />}
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
                  isAuth={!!memberships?.length && !memberSet}
                  redirectTo={ENTRY_POINT_ROUTE}
                />
                <PrivateRoute
                  path={relativeRoutes.studio.signInJoin()}
                  element={<SignInJoinView />}
                  isAuth={!memberships?.length}
                  redirectTo={ENTRY_POINT_ROUTE}
                />
                <PrivateRoute
                  path={relativeRoutes.studio.newChannel()}
                  element={<CreateEditChannelView newChannel />}
                  isAuth={memberSet && !!memberships?.length}
                  redirectTo={ENTRY_POINT_ROUTE}
                />
                <PrivateRoute
                  path={relativeRoutes.studio.editChannel()}
                  element={<CreateEditChannelView />}
                  isAuth={channelSet && !!memberships?.length}
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
                  isAuth={channelSet && !!memberships?.length}
                  redirectTo={ENTRY_POINT_ROUTE}
                />
                <PrivateRoute
                  path={relativeRoutes.studio.videos()}
                  element={<MyVideosView />}
                  isAuth={channelSet && !!memberships?.length}
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

const fullWidthLayout = css`
  :root {
    --sidenav-collapsed-width: 0;
  }
`

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
