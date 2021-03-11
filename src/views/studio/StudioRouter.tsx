import React from 'react'
import { Route, Routes } from 'react-router'
import { MyVideosView } from '..'

const routesMap = [{ path: './videos', Component: MyVideosView }]

const StudioRouter = () => {
  return (
    <>
      {routesMap.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </>
  )
}

export default StudioRouter
