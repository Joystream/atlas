import React from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'
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
  useConnectionStatus,
  SnackbarProvider,
  EditVideoSheetProvider,
  useVideoEditSheetRouting,
} from '@/hooks'
import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import { ViewErrorFallback, StudioTopbar, StudioSidenav, NoConnectionIndicator, TOP_NAVBAR_HEIGHT } from '@/components'

const studioRoutes = [
  { path: relativeRoutes.studio.newChannel(), element: <CreateEditChannelView newChannel /> },
  { path: relativeRoutes.studio.editChannel(), element: <CreateEditChannelView /> },
  { path: relativeRoutes.studio.videos(), element: <MyVideosView /> },
  { path: relativeRoutes.studio.signIn(), element: <SignInView /> },
  { path: relativeRoutes.studio.signInJoin(), element: <SignInJoinView /> },
  { path: relativeRoutes.studio.newMembership(), element: <CreateMemberView /> },
  { path: relativeRoutes.studio.uploads(), element: <MyUploadsView /> },
]

const StudioLayout = () => {
  const { isUserConnectedToInternet, nodeConnectionStatus } = useConnectionStatus()

  const navigate = useNavigate()
  const displayedLocation = useVideoEditSheetRouting()

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because DismissibleMessage in video drafts depends on it

  return (
    <>
      <NoConnectionIndicator
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={isUserConnectedToInternet}
      />
      <StudioTopbar />
      <StudioSidenav />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorFallback}
          onReset={() => {
            navigate(absoluteRoutes.studio.index())
          }}
        >
          <Routes location={displayedLocation}>
            {studioRoutes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </ErrorBoundary>
      </MainContainer>
      <EditVideoSheet />
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
