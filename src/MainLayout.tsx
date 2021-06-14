import loadable from '@loadable/component'
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { TopbarBase, StudioLoading } from '@/components'
import { BASE_PATHS } from '@/config/routes'
import { useDialog } from '@/hooks'
import { GlobalStyle } from '@/shared/components'
import { routingTransitions } from '@/styles/routingTransitions'
import { isBrowserOutdated } from '@/utils/broswer'

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

const MainLayout: React.FC = () => {
  const [openDialog, closeDialog] = useDialog({
    title: 'Outdated browser detected',
    description: 'It seems your browser is outdated, the Joystream app may not work properly',
    variant: 'warning',
    primaryButtonText: 'I understand',
    onPrimaryButtonClick: () => closeDialog(),
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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default MainLayout
