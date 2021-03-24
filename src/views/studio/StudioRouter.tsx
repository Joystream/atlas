import React from 'react'
import { Routes, Route } from 'react-router'
import { studioRoutes } from '@/config/routes'
import { CreateEditChannelView, MyVideosView } from '@/views/studio'

const routesMap = [
  { path: studioRoutes.newChannel(), Component: <CreateEditChannelView newChannel /> },
  { path: studioRoutes.editChannel(), Component: <CreateEditChannelView /> },
  { path: studioRoutes.videos(), Component: <MyVideosView /> },
]

const StudioRouter = () => {
  return (
    <Routes>
      {routesMap.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} />
      ))}
    </Routes>
  )
}

export default StudioRouter
