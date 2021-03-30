import React from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'

import { CreateEditChannelView, MyVideosView, MyUploadsView } from '.'
import { JoystreamProvider, ActiveUserProvider, DraftsProvider, PersonalDataProvider, useDrafts } from '@/hooks'

import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import { ViewErrorFallback, StudioTopbar, NavItemType, Sidenav, TOP_NAVBAR_HEIGHT } from '@/components'
import SignInView from './SignInView'
import SelectMembershipView from './SelectMembershipView'
import CreateMemberView from './CreateMemberView'

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
  const { drafts } = useDrafts('video')

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because Sidenav depends on it for FollowedChannel

  const unseenDraftsLength = drafts.filter((draft) => draft.seen === false).length
  const badges = [
    { name: studioNavbarItems[0].name, number: unseenDraftsLength },
    { name: studioNavbarItems[1].name, number: 0 },
    { name: studioNavbarItems[2].name, number: 0 },
  ]

  return (
    <>
      <StudioTopbar />
      <Sidenav items={studioNavbarItems} isStudio badges={badges} />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorFallback}
          onReset={() => {
            navigate(absoluteRoutes.studio.index())
          }}
        >
          <Routes>
            {studioRoutes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </ErrorBoundary>
      </MainContainer>
    </>
  )
}

const StudioLayoutWrapper = () => {
  return (
    <DraftsProvider>
      <PersonalDataProvider>
        <ActiveUserProvider>
          <StudioLayout />
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

export default StudioLayoutWrapper
