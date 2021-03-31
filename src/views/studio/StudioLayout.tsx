import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useMatch } from 'react-router'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { Location } from 'history'

import { CreateEditChannelView, MyVideosView, UploadEditVideoActionSheet } from '.'
import { ActiveUserProvider, DraftsProvider, PersonalDataProvider } from '@/hooks'
import routes from '@/config/routes'
import { ViewErrorFallback, StudioTopbar, NavItemType, Sidenav, TOP_NAVBAR_HEIGHT } from '@/components'
import { VideoActionSheetProvider } from './UploadEditVideoActionSheet/useVideoActionSheet'

const studioRoutes = [
  { path: routes.studio.newChannel(), element: <CreateEditChannelView newChannel /> },
  { path: routes.studio.editChannel(), element: <CreateEditChannelView /> },
  { path: routes.studio.videos(), element: <MyVideosView /> },
]

const studioNavbarItems: NavItemType[] = [
  {
    icon: 'my-videos',
    name: 'Videos',
    expandedName: 'My Videos',
    to: routes.studio.videos(),
  },
  {
    icon: 'my-channel',
    name: 'Channel',
    expandedName: 'My Channel',
    to: routes.studio.editChannel(),
  },
  {
    icon: 'my-uploads',
    name: 'Uploads',
    expandedName: 'My Uploads',
    to: routes.studio.uploads(),
  },
]

const StudioLayout = () => {
  const navigate = useNavigate()
  const [cachedLocation, setCachedLocation] = useState<Location>()
  const uploadVideoMatch = useMatch({ path: `${routes.studio.uploadVideo()}` })
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
            <StudioTopbar />
            <Sidenav items={studioNavbarItems} isStudio />
            <MainContainer>
              <ErrorBoundary
                fallback={ViewErrorFallback}
                onReset={() => {
                  navigate(routes.studio.index())
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
