import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import { GlobalStyle } from '@/shared/components'
import { BASE_PATHS } from '@/config/routes'
import { ViewerLayout } from './views/viewer'
import { PlaygroundLayout } from './views/playground'
import { TopbarBase, StudioLoading } from '@/components'

const LoadableStudioLayout = loadable(() => import('./views/studio/StudioLayout'), {
  fallback: (
    <>
      <TopbarBase variant="studio" />
      <StudioLoading />
    </>
  ),
})

const MainLayout: React.FC = () => {
  return (
    <>
      <GlobalStyle />
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
