import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useMatch } from 'react-router'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { Location } from 'history'

import { CreateEditChannelView, MyUploadsView, MyVideosView, UploadEditVideoActionSheet } from '.'
import {
  JoystreamProvider,
  ActiveUserProvider,
  DraftsProvider,
  PersonalDataProvider,
  useConnectionStatus,
  SnackbarProvider,
} from '@/hooks'

import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import { ViewErrorFallback, StudioTopbar, StudioSidenav, NoConnectionIndicator, TOP_NAVBAR_HEIGHT } from '@/components'

import SignInView from './SignInView'
import SelectMembershipView from './SelectMembershipView'
import CreateMemberView from './CreateMemberView'
import { VideoActionSheetProvider } from './UploadEditVideoActionSheet/useVideoActionSheet'

const studioRoutes = [
  { path: relativeRoutes.studio.newChannel(), element: <CreateEditChannelView newChannel /> },
  { path: relativeRoutes.studio.editChannel(), element: <CreateEditChannelView /> },
  { path: relativeRoutes.studio.videos(), element: <MyVideosView /> },
  { path: relativeRoutes.studio.signIn(), element: <SignInView /> },
  { path: relativeRoutes.studio.selectMembership(), element: <SelectMembershipView /> },
  { path: relativeRoutes.studio.newMembership(), element: <CreateMemberView /> },
  { path: relativeRoutes.studio.uploads(), element: <MyUploadsView /> },
]

const StudioLayout = () => {
  const navigate = useNavigate()
  const { isUserConnectedToInternet, nodeConnectionStatus } = useConnectionStatus()
  const location = useLocation()
  const [cachedLocation, setCachedLocation] = useState<Location>()
  const uploadVideoMatch = useMatch({ path: `${relativeRoutes.studio.uploadVideo()}` })
  useEffect(() => {
    if (!uploadVideoMatch) {
      setCachedLocation(location)
    }
  }, [cachedLocation, location, uploadVideoMatch])

  const displayedLocation = uploadVideoMatch ? cachedLocation : location

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because DismissibleMessage in video drafts depends on it

  return (
    <VideoActionSheetProvider>
      <SnackbarProvider>
        <DraftsProvider>
          <PersonalDataProvider>
            <ActiveUserProvider>
              <JoystreamProvider>
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
                <UploadEditVideoActionSheet />
              </JoystreamProvider>
            </ActiveUserProvider>
          </PersonalDataProvider>
        </DraftsProvider>
      </SnackbarProvider>
    </VideoActionSheetProvider>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

export default StudioLayout
