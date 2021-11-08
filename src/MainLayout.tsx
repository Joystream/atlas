import loadable from '@loadable/component'
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { StudioLoading } from '@/components/StudioLoading'
import { TopbarBase } from '@/components/TopbarBase'
import { SvgJoystreamLogoStudio } from '@/components/illustrations'
import { AdminOverlay } from '@/components/overlays/AdminOverlay'
import { BASE_PATHS, absoluteRoutes } from '@/config/routes'
import { isBrowserOutdated } from '@/utils/browser'

import { useConfirmationModal } from './providers/confirmationModal'
import { LegalLayout } from './views/legal'
import { ViewerLayout } from './views/viewer/ViewerLayout'

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
  const [openDialog, closeDialog] = useConfirmationModal({
    title: 'Outdated browser detected',
    description:
      'It seems the browser version you are using is not fully supported by Joystream. Some of the features may be broken or not accessible. For the best experience, please upgrade your browser to the latest version.',
    iconType: 'warning',
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

  return (
    <>
      <Routes>
        <Route path={BASE_PATHS.viewer + '/*'} element={<ViewerLayout />} />
        <Route path={BASE_PATHS.legal + '/*'} element={<LegalLayout />} />
        <Route path={BASE_PATHS.studio + '/*'} element={<LoadableStudioLayout />} />
        <Route path={BASE_PATHS.playground + '/*'} element={<LoadablePlaygroundLayout />} />
      </Routes>
      <AdminOverlay />
    </>
  )
}
