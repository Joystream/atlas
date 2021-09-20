import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import shallow from 'zustand/shallow'

import { NoConnectionIndicator } from '@/components/NoConnectionIndicator'
import { PrivateRoute } from '@/components/PrivateRoute'
import { StudioEntrypoint } from '@/components/StudioEntrypoint'
import { StudioLoading } from '@/components/StudioLoading'
import { StudioSidenav } from '@/components/StudioSidenav'
import { StudioTopbar } from '@/components/StudioTopbar'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopbarBase'
import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { ConnectionStatusManager, useConnectionStatusStore } from '@/providers/connectionStatus'
import { useDialog } from '@/providers/dialogs'
import { EditVideoSheetProvider, useVideoEditSheetRouting } from '@/providers/editVideoSheet'
import { JoystreamProvider } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { TransactionManager } from '@/providers/transactionManager'
import { UploadsManager, useUploadsStore } from '@/providers/uploadsManager'
import { ActiveUserProvider, useUser } from '@/providers/user'
import { SvgGlyphExternal } from '@/shared/icons'
import { isAllowedBrowser } from '@/utils/browser'
import {
  CreateEditChannelView,
  CreateMemberView,
  EditVideoSheet,
  MyUploadsView,
  MyVideosView,
  SignInJoinView,
  SignInView,
} from '@/views/studio'

const ENTRY_POINT_ROUTE = absoluteRoutes.studio.index()
const UPLOADED_SNACKBAR_TIMEOUT = 13000

const StudioLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const displayedLocation = useVideoEditSheetRouting()
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const { displaySnackbar } = useSnackbar()
  const displayedSnackbars = useRef<string[]>([])

  const { activeAccountId, activeMemberId, activeChannelId, extensionConnected, memberships, userInitialized } =
    useUser()
  const channelUploads = useUploadsStore(
    (state) => state.uploads.filter((asset) => asset.owner === activeChannelId),
    shallow
  )
  const assetsFiles = useUploadsStore((state) => state.assetsFiles)
  const videoAsset = assetsFiles.find(
    (asset) =>
      channelUploads.map((upload) => upload.contentId).includes(asset.contentId) && /video/.test(asset.blob.type)
  )
  const videoAssetStatus = useUploadsStore((state) => videoAsset && state.uploadsStatus[videoAsset.contentId], shallow)

  const [openUnsupportedBrowserDialog, closeUnsupportedBrowserDialog] = useDialog()
  const [enterLocation] = useState(location.pathname)
  const hasMembership = !!memberships?.length

  const accountSet = !!activeAccountId && !!extensionConnected
  const memberSet = accountSet && !!activeMemberId && hasMembership
  const channelSet = memberSet && !!activeChannelId && hasMembership

  useEffect(() => {
    if (
      videoAsset &&
      videoAssetStatus?.lastStatus === 'completed' &&
      !displayedSnackbars.current.includes(videoAsset.contentId)
    ) {
      displaySnackbar({
        customId: videoAsset.contentId,
        title: 'Video ready to be reviewed',
        description: (videoAsset.blob as File).name,
        iconType: 'success',
        timeout: UPLOADED_SNACKBAR_TIMEOUT,
        actionText: 'See on Joystream',
        actionIcon: <SvgGlyphExternal />,
        onActionClick: () => navigate(absoluteRoutes.viewer.channel(activeChannelId || undefined)),
      })
      displayedSnackbars.current.push(videoAsset.contentId)
    }
  }, [activeChannelId, displaySnackbar, navigate, videoAsset, videoAssetStatus])

  useEffect(() => {
    if (!isAllowedBrowser()) {
      openUnsupportedBrowserDialog({
        variant: 'warning',
        title: 'Unsupported browser detected',
        description:
          'It seems the browser you are using is not fully supported by Joystream Studio. Some of the features may not be accessible. For the best experience, please use a recent version of Chrome, Firefox or Edge.',
        primaryButton: {
          text: 'I understand',
          onClick: () => {
            closeUnsupportedBrowserDialog()
          },
        },
        onExitClick: () => {
          closeUnsupportedBrowserDialog()
        },
      })
    }
  }, [closeUnsupportedBrowserDialog, openUnsupportedBrowserDialog])

  return (
    <>
      <NoConnectionIndicator
        nodeConnectionStatus={nodeConnectionStatus}
        isConnectedToInternet={internetConnectionStatus === 'connected'}
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
  height: 100%;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  margin-left: var(--sidenav-collapsed-width);
`

const StudioLayoutWrapper: React.FC = () => {
  const navigate = useNavigate()
  return (
    <ErrorBoundary
      fallback={ViewErrorBoundary}
      onReset={() => {
        navigate(absoluteRoutes.studio.index())
      }}
    >
      <ActiveUserProvider>
        <EditVideoSheetProvider>
          <JoystreamProvider>
            <ConnectionStatusManager />
            <UploadsManager />
            <TransactionManager />
            <StudioLayout />
          </JoystreamProvider>
        </EditVideoSheetProvider>
      </ActiveUserProvider>
    </ErrorBoundary>
  )
}

export default StudioLayoutWrapper
