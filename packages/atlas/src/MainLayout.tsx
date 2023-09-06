import loadable from '@loadable/component'
import { FC, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'

import { StudioLoading } from '@/components/_loaders/StudioLoading'
import { CookiePopover } from '@/components/_overlays/CookiePopover'
import { atlasConfig } from '@/config'
import { BASE_PATHS, absoluteRoutes } from '@/config/routes'
import { useTimeMismatchWarning } from '@/hooks/useTimeMismatchWarning'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'
import { isBrowserOutdated } from '@/utils/browser'
import { SentryLogger } from '@/utils/logs'

import { AppLogo } from './components/AppLogo'
import { TopbarBase } from './components/_navigation/TopbarBase'
import { useConfirmationModal } from './providers/confirmationModal'
import { useOverlayManager } from './providers/overlayManager'
import { LegalLayout } from './views/legal/LegalLayout'
import { ViewerLayout } from './views/viewer/ViewerLayout'

history.scrollRestoration = 'manual'
const ROUTING_ANIMATION_OFFSET = 100

const LoadableStudioLayout = loadable(
  () => import('./views/studio/StudioLayout').then((module) => ({ default: module.StudioLayout })),
  {
    fallback: (
      <>
        <TopbarBase
          fullLogoNode={<AppLogo variant="studio" height={32} width={undefined} />}
          logoLinkUrl={absoluteRoutes.studio.index()}
        />
        <StudioLoading />
      </>
    ),
  }
)

const LoadablePlaygroundLayout = loadable(
  () => import('./views/playground/PlaygroundLayout').then((module) => ({ default: module.PlaygroundLayout })),
  {
    fallback: <h1>Loading Playground...</h1>,
  }
)

export const MainLayout: FC = () => {
  useTimeMismatchWarning()
  const scrollPosition = useRef<number>(0)
  const location = useLocation()

  const navigationType = useNavigationType()
  const [cachedLocation, setCachedLocation] = useState(location)
  const locationState = location.state as RoutingState
  const [openDialog, closeDialog] = useConfirmationModal({
    title: 'Outdated browser detected',
    description:
      'It seems the browser version you are using is not fully supported by Joystream. Some of the features may be broken or not accessible. For the best experience, please upgrade your browser to the latest version.',
    type: 'warning',
    primaryButton: {
      text: 'Click here to see instructions',
      onClick: () => window.open('https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'),
    },
    onExitClick: () => closeDialog(),
  })

  useEffect(() => {
    if (!atlasConfig.analytics.sentry?.dsn) {
      return
    }

    const stopReplay = async () => await SentryLogger.replay?.stop()

    if (location.pathname === absoluteRoutes.viewer.ypp()) {
      if (SentryLogger.initialized && !SentryLogger.replay?.getReplayId()) {
        SentryLogger.replay?.start()
      }
    } else {
      if (SentryLogger.replay?.getReplayId()) {
        stopReplay()
      }
    }
  }, [location.pathname])

  const { clearOverlays } = useOverlayManager()

  useEffect(() => {
    if (isBrowserOutdated) {
      openDialog()
    }
  }, [openDialog])

  useEffect(() => {
    if (location.pathname === cachedLocation.pathname) {
      return
    }
    clearOverlays()

    setCachedLocation(location)

    if (locationState?.overlaidLocation?.pathname === location.pathname) {
      // if exiting routing overlay, skip scroll to top
      return
    }
    if (navigationType !== 'POP') {
      scrollPosition.current = window.scrollY
    }
    // delay scroll to allow transition to finish first
    setTimeout(() => {
      window.scrollTo(0, navigationType !== 'POP' ? 0 : scrollPosition.current)
    }, parseInt(transitions.timings.routing) + ROUTING_ANIMATION_OFFSET)
  }, [location, cachedLocation, locationState, navigationType, clearOverlays])

  return (
    <>
      <CookiePopover />
      <Routes>
        <Route path={BASE_PATHS.viewer + '/*'} element={<ViewerLayout />} />
        <Route path={BASE_PATHS.legal + '/*'} element={<LegalLayout />} />
        <Route path={BASE_PATHS.studio + '/*'} element={<LoadableStudioLayout />} />
        <Route path={BASE_PATHS.playground + '/*'} element={<LoadablePlaygroundLayout />} />
      </Routes>
    </>
  )
}
