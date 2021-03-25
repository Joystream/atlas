import React from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'

import { CreateEditChannelView, MyVideosView } from '.'
import { ActiveUserProvider, DraftsProvider, PersonalDataProvider } from '@/hooks'
import routes from '@/config/routes'
import { ViewErrorFallback, StudioTopbar, NavItemType, Sidenav, TOP_NAVBAR_HEIGHT } from '@/components'

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

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because Sidenav depends on it for FollowedChannel
  return (
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
              <Routes>
                {studioRoutes.map((route) => (
                  <Route key={route.path} {...route} />
                ))}
              </Routes>
            </ErrorBoundary>
          </MainContainer>
        </ActiveUserProvider>
      </PersonalDataProvider>
    </DraftsProvider>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

export default StudioLayout
