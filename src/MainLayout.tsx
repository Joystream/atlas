import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import { GlobalStyle } from '@/shared/components'
import routes from '@/config/routes'
import { routingTransitions } from '@/styles/routingTransitions'
import { ViewerLayout } from './views/viewer'
import { PlaygroundLayout } from './views/playground'

const LoadableStudioLayout = loadable(() => import('./views/studio/StudioLayout'), {
  // TODO: improve
  fallback: <div>Loading...</div>,
})

const MainLayout: React.FC = () => {
  return (
    <>
      <GlobalStyle additionalStyles={routingTransitions} />
      <BrowserRouter>
        <Routes>
          <Route path={`${routes.viewer.index()}/*`} element={<ViewerLayout />} />
          <Route path={`${routes.studio.index()}/*`} element={<LoadableStudioLayout />} />
          <Route path={`${routes.playground.index()}/*`} element={<PlaygroundLayout />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default MainLayout
