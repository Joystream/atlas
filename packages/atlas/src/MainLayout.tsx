import loadable from '@loadable/component'
import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'

import { SvgJoystreamLogoStudio } from '@/components/_illustrations'
import { StudioLoading } from '@/components/_loaders/StudioLoading'
import { AdminOverlay } from '@/components/_overlays/AdminOverlay'
import { CookiePopover } from '@/components/_overlays/CookiePopover'
import { BASE_PATHS, absoluteRoutes } from '@/config/routes'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'
import { isBrowserOutdated } from '@/utils/browser'

import { TopbarBase } from './components/_navigation/TopbarBase'
import { useConfirmationModal } from './providers/confirmationModal'
import { LegalLayout } from './views/legal'
import { EmbeddedView } from './views/viewer'
import { ViewerLayout } from './views/viewer/ViewerLayout'

history.scrollRestoration = 'manual'
const ROUTING_ANIMATION_OFFSET = 100

const LoadableStudioLayout = loadable(() => import('./views/studio/StudioLayout'), {
  fallback: (
    <>
      <TopbarBase fullLogoNode={<SvgJoystreamLogoStudio />} logoLinkUrl={absoluteRoutes.studio.index()} />
      <StudioLoading />
    </>
  ),
})

const LoadablePlaygroundLayout = loadable(() => import('./views/playground/PlaygroundLayout'), {
  fallback: <h1>Loading Playground...</h1>,
})

export const MainLayout: React.FC = () => {
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
    if (isBrowserOutdated) {
      openDialog()
    }
  }, [openDialog])

  useEffect(() => {
    if (location.pathname === cachedLocation.pathname) {
      return
    }

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
  }, [location, cachedLocation, locationState, navigationType])

  return (
    <>
      <CookiePopover />
      <Routes>
        <Route path={absoluteRoutes.embedded.video()} element={<EmbeddedView />} />
        <Route path={BASE_PATHS.viewer + '/*'} element={<ViewerLayout />} />
        <Route path={BASE_PATHS.legal + '/*'} element={<LegalLayout />} />
        <Route path={BASE_PATHS.studio + '/*'} element={<LoadableStudioLayout />} />
        <Route path={BASE_PATHS.playground + '/*'} element={<LoadablePlaygroundLayout />} />
      </Routes>
      <AdminOverlay />
    </>
  )
}
