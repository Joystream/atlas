import { Route, Routes } from 'react-router-dom'

import { CommonProviders } from '@/CommonProviders'
import { absoluteRoutes } from '@/config/routes'
import { EmbeddedView } from '@/views/viewer'

export const App = () => {
  return (
    <CommonProviders>
      <Routes>
        <Route path={absoluteRoutes.embedded.video()} element={<EmbeddedView />} />
      </Routes>
    </CommonProviders>
  )
}
