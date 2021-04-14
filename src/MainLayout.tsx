import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import { GlobalStyle } from '@/shared/components'
import { BASE_PATHS } from '@/config/routes'
import { routingTransitions } from '@/styles/routingTransitions'
import { ViewerLayout } from './views/viewer'
import { PlaygroundLayout } from './views/playground'
import { TopbarBase, LoadingStudio } from '@/components'

const LoadableStudioLayout = loadable(() => import('./views/studio/StudioLayout'), {
  // TODO: improve
  fallback: (
    <>
      <TopbarBase variant="studio" />
      <LoadingStudio />
    </>
  ),
})

const MainLayout: React.FC = () => {
  return (
    <>
      <GlobalStyle additionalStyles={routingTransitions} />
      <BrowserRouter>
        <Routes>
          <Route path={BASE_PATHS.viewer + '/*'} element={<ViewerLayout />} />
          <Route path={BASE_PATHS.studio + '/*'} element={<LoadableStudioLayout />} />
          <Route path={BASE_PATHS.playground + '/*'} element={<PlaygroundLayout />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default MainLayout
