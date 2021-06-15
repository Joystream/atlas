import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate, useLocation } from 'react-router-dom'

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
import { relativeRoutes, absoluteRoutes } from '@/config/routes'
import {
  JoystreamProvider,
  ActiveUserProvider,
  DraftsProvider,
  PersonalDataProvider,
  EditVideoSheetProvider,
  useVideoEditSheetRouting,
  useConnectionStatus,
  useUser,
  UploadManagerProvider,
  TransactionManagerProvider,
  DialogProvider,
  useDialog,
} from '@/hooks'
import { isAllowedBrowser } from '@/utils/broswer'

import {
  CreateEditChannelView,
  EditVideoSheet,
  MyUploadsView,
  MyVideosView,
  SignInView,
  SignInJoinView,
  CreateMemberView,
} from '.'

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()

const StudioLayout = () => {
  const location = useLocation()
  const displayedLocation = useVideoEditSheetRouting()
  const { isUserConnectedToInternet, nodeConnectionStatus } = useConnectionStatus()

  const {
    activeAccountId,
    activeMemberId,
    activeChannelId,
    extensionConnected,
    memberships,
    userInitialized,
  } = useUser()

  const [openUnsupportedBrowserDialog, closeUnsupportedBrowserDialog] = useDialog()
  const [enterLocation] = useState(location.pathname)
  const hasMembership = !!memberships?.length

  const accountSet = !!activeAccountId && !!extensionConnected
  const memberSet = accountSet && !!activeMemberId && hasMembership
  const channelSet = memberSet && !!activeChannelId && hasMembership

  useEffect(() => {
    if (!isAllowedBrowser()) {
      openUnsupportedBrowserDialog({
        variant: 'warning',
        title: 'Unsupported browser detected',
        description:
          'It seems the browser you are using is not fully supported by Joystream Studio. Some of the features may not be accessible. For the best experience, please use a recent version of Chrome, Firefox or Edge.',
        primaryButtonText: 'I understand',
        onPrimaryButtonClick: () => {
          closeUnsupportedBrowserDialog()
        },
        onExitClick: () => {
          closeUnsupportedBrowserDialog()
        },
      })
    }
  }, [closeUnsupportedBrowserDialog, openUnsupportedBrowserDialog])

  // TODO: add route transition
  // TODO: remove dependency on PersonalDataProvider
  //  we need PersonalDataProvider because DismissibleMessage in video drafts depends on it
  return (
    <>
      <NoConnectionIndicator
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={isUserConnectedToInternet}
      />
      <StudioTopbar fullWidth={!channelSet || !memberSet} hideChannelInfo={!memberSet} />
      {channelSet && <StudioSidenav />}
      {!userInitialized ? (
        <StudioLoading />
      ) : (
        <>
          <MainContainer>
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
          {channelSet && <EditVideoSheet />}
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

const StudioLayoutWrapper: React.FC = () => {
  const navigate = useNavigate()
  return (
    <ErrorBoundary
      fallback={ViewErrorFallback}
      onReset={() => {
        navigate(absoluteRoutes.studio.index())
      }}
    >
      <DialogProvider>
        <ActiveUserProvider>
          <PersonalDataProvider>
            <UploadManagerProvider>
              <DraftsProvider>
                <EditVideoSheetProvider>
                  <JoystreamProvider>
                    <TransactionManagerProvider>
                      <StudioLayout />
                    </TransactionManagerProvider>
                  </JoystreamProvider>
                </EditVideoSheetProvider>
              </DraftsProvider>
            </UploadManagerProvider>
          </PersonalDataProvider>
        </ActiveUserProvider>
      </DialogProvider>
    </ErrorBoundary>
  )
}

export default StudioLayoutWrapper
