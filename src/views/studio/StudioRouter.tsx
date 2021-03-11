import styled from '@emotion/styled'
import React from 'react'
import { Routes, Route } from 'react-router'
import { studioRoutes } from '@/config/routes'
import { CreateEditChannelView } from '@/views/studio'

const routesMap = [
  { path: studioRoutes.newChannel(), Component: <CreateEditChannelView newChannel /> },
  { path: studioRoutes.editChannel(), Component: <CreateEditChannelView /> },
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

const Container = styled.div`
  --max-inner-width: calc(1440px);
  max-width: var(--max-inner-width);
  margin: 0 auto;
`
