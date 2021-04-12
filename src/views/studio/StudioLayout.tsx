import React, { useState, useEffect, useCallback } from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate, useLocation } from 'react-router-dom'
import { web3Enable } from '@polkadot/extension-dapp'
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
} from '@/hooks'
import { useMembership, useMemberships } from '@/api/hooks'

import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import {
  ViewErrorFallback,
  StudioTopbar,
  StudioSidenav,
  NoConnectionIndicator,
  TOP_NAVBAR_HEIGHT,
  LoadingStudio,
} from '@/components'

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
  const navigate = useNavigate()
  const location = useLocation()
  const { isUserConnectedToInternet, nodeConnectionStatus } = useConnectionStatus()
  const [enterLocation] = useState(location.pathname)
  const [extensionLoading, setExtensionLoading] = useState(true)
  const [extensionConnected, setExtensionConnected] = useState(false)
  // const { accounts, joystream, extensionConnected } = useJoystream()
  const {
    activeUser: { accountId, memberId, channelId },
    setActiveChannel,
    loading: activeUserLoading,
  } = useActiveUser()
  const { membership, loading: membershipLoading, error } = useMembership(
    {
      where: { id: memberId },
    },
    {
      skip: !memberId,
    }
  )
  const { memberships, loading: membershipsLoading, error: membershipsError } = useMemberships(
    { where: { controllerAccount_eq: accountId } },
    {
      skip: !accountId,
    }
  )

  useEffect(() => {
    if (location.pathname === '/studio/') {
      navigate(absoluteRoutes.studio.videos())
    }
  }, [location, navigate])

  useEffect(() => {
    if (extensionConnected) {
      return
    }
    const getExtension = async () => {
      const extensions = await web3Enable('Joystream Atlas')
      setExtensionLoading(false)
      if (!extensions.length) {
        navigate(absoluteRoutes.studio.signIn())
      } else {
        setExtensionConnected(true)
      }
    }
    getExtension()
  }, [extensionConnected, navigate])

  useEffect(() => {
    if (activeUserLoading || channelId || !extensionConnected) {
      return
    }
    if (!accountId) {
      navigate(absoluteRoutes.studio.signIn())
      return
    }
    if (!memberId) {
      if (membershipsLoading) {
        return
      }
      if (memberships?.length) {
        navigate(absoluteRoutes.studio.signIn())
      }
    }
  }, [
    accountId,
    activeUserLoading,
    channelId,
    extensionConnected,
    memberId,
    memberships?.length,
    membershipsLoading,
    navigate,
  ])

  useEffect(() => {
    if (activeUserLoading || channelId || !extensionConnected || !memberId || !accountId) {
      return
    }
    if (membershipLoading) {
      return
    }
    if (!membership?.channels.length) {
      navigate(absoluteRoutes.studio.newChannel())
      return
    }
    setActiveChannel(membership.channels[0].id)
    navigate(enterLocation)
  }, [
    accountId,
    activeUserLoading,
    channelId,
    enterLocation,
    extensionConnected,
    memberId,
    membership,
    membershipLoading,
    navigate,
    setActiveChannel,
  ])

  const navigate = useNavigate()
  const displayedLocation = useVideoEditSheetRouting()

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because Sidenav depends on it for FollowedChannel

  const authenticated = !!accountId && !!memberId && !!channelId

  return (
    <>
      <NoConnectionIndicator
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={isUserConnectedToInternet}
      />
      <StudioTopbar hideChannelInfo={!authenticated} />
      {authenticated && <StudioSidenav />}
      {extensionLoading ? (
        <LoadingStudio />
      ) : (
        <>
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
