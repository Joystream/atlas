import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useMatch } from 'react-router'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { Location } from 'history'

import { CreateEditChannelView, MyVideosView, MyUploadsView, UploadEditVideoActionSheet } from '.'
import { JoystreamProvider, ActiveUserProvider, DraftsProvider, PersonalDataProvider } from '@/hooks'

import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import { ViewErrorFallback, StudioTopbar, NavItemType, Sidenav, TOP_NAVBAR_HEIGHT } from '@/components'
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

const studioNavbarItems: NavItemType[] = [
  {
    icon: 'my-videos',
    name: 'Videos',
    expandedName: 'My Videos',
    to: absoluteRoutes.studio.videos(),
  },
  {
    icon: 'my-channel',
    name: 'Channel',
    expandedName: 'My Channel',
    to: absoluteRoutes.studio.editChannel(),
  },
  {
    icon: 'my-uploads',
    name: 'Uploads',
    expandedName: 'My Uploads',
    to: absoluteRoutes.studio.uploads(),
  },
]

const StudioLayout = () => {
  const navigate = useNavigate()
  const [cachedLocation, setCachedLocation] = useState<Location>()
  const uploadVideoMatch = useMatch({ path: `${relativeRoutes.studio.uploadVideo()}` })
  const location = useLocation()

  useEffect(() => {
    if (!uploadVideoMatch) {
      setCachedLocation(location)
    }
  }, [cachedLocation, location, uploadVideoMatch])

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because Sidenav depends on it for FollowedChannel
  const displayedLocation = uploadVideoMatch ? cachedLocation : location
  return (
    <VideoActionSheetProvider>
      <DraftsProvider>
        <PersonalDataProvider>
          <ActiveUserProvider>
            <JoystreamProvider>
              <StudioTopbar />
              <Sidenav items={studioNavbarItems} isStudio />
              <MainContainer>
                <ErrorBoundary
                  fallback={ViewErrorFallback}
                  onReset={() => {
                    navigate(relativeRoutes.studio.index())
                  }}
                >
                  <Routes>
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
    </VideoActionSheetProvider>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

export default StudioLayout
