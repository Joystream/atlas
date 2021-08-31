import loadable from '@loadable/component'
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { StudioLoading } from '@/components/StudioLoading'
import { TopbarBase } from '@/components/Topbar'
import { BASE_PATHS } from '@/config/routes'
import { isBrowserOutdated } from '@/utils/browser'

import { useDialog } from './providers/dialogs'
import { AdminView } from './views/admin'
import { LegalLayout } from './views/legal'
import { ViewerLayout } from './views/viewer/ViewerLayout'

const LoadableStudioLayout = loadable(() => import('./views/studio/StudioLayout'), {
  fallback: (
    <>
      <TopbarBase variant="studio" />
      <StudioLoading />
    </>
  ),
})

const LoadablePlaygroundLayout = loadable(() => import('./views/playground/PlaygroundLayout'), {
  fallback: <h1>Loading Playground...</h1>,
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
    <Routes>
      <Route path={BASE_PATHS.viewer + '/*'} element={<ViewerLayout />} />
      <Route path={BASE_PATHS.legal + '/*'} element={<LegalLayout />} />
      <Route path={BASE_PATHS.studio + '/*'} element={<LoadableStudioLayout />} />
      <Route path={BASE_PATHS.playground + '/*'} element={<LoadablePlaygroundLayout />} />
      <Route path={BASE_PATHS.admin + '/*'} element={<AdminView />} />
    </Routes>
  )
}
