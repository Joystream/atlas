import loadable from '@loadable/component'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { StudioLoading, TopbarBase } from '@/components'
import { BASE_PATHS } from '@/config/routes'
import { GlobalStyle } from '@/shared/components'
import { routingTransitions } from '@/styles/routingTransitions'
import { isBrowserOutdated } from '@/utils/browser'

import { useDialog } from './providers'
import { AdminView } from './views/admin'
import { LegalLayout } from './views/legal'
import { PlaygroundLayout } from './views/playground'
import { ViewerLayout } from './views/viewer'

const LoadableStudioLayout = loadable(() => import('./views/studio/StudioLayout'), {
  fallback: (
    <>
      <TopbarBase variant="studio" />
      <StudioLoading />
    </>
  ),
})

export const MainLayout: React.FC = () => {
  const [openDialog, closeDialog] = useDialog({
    title: 'Outdated browser detected',
    description:
      'It seems the browser version you are using is not fully supported by Joystream. Some of the features may be broken or not accessible. For the best experience, please upgrade your browser to the latest version.',
    variant: 'warning',
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
      <GlobalStyle additionalStyles={[routingTransitions]} />
      <BrowserRouter>
        <Routes>
          <Route path={BASE_PATHS.viewer + '/*'} element={<ViewerLayout />} />
          <Route path={BASE_PATHS.legal + '/*'} element={<LegalLayout />} />
          <Route path={BASE_PATHS.studio + '/*'} element={<LoadableStudioLayout />} />
          <Route path={BASE_PATHS.playground + '/*'} element={<PlaygroundLayout />} />
          <Route path={BASE_PATHS.admin + '/*'} element={<AdminView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
