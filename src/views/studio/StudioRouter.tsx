import React from 'react'
import { Routes, Route, useNavigate } from 'react-router'
import { studioRoutes } from '@/config/routes'
import { Button } from '@/shared/components'
import { CreateEditChannelView, MyVideosView } from '@/views/studio'

const routesMap = [
  { path: studioRoutes.newChannel(), Component: <CreateEditChannelView newChannel /> },
  { path: studioRoutes.editChannel(), Component: <CreateEditChannelView /> },
  { path: studioRoutes.videos(), Component: <MyVideosView /> },
]

const StudioRouter: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* TODO: remove later */}
      <Button
        onClick={() => {
          navigate(studioRoutes.uploadVideo())
          console.log('navigate to upload')
        }}
      >
        Open upload video sheet
      </Button>

      <Routes>
        {routesMap.map(({ path, Component }) => (
          <Route key={path} path={path} element={Component} />
        ))}
      </Routes>
    </>
  )
}

export default StudioRouter
