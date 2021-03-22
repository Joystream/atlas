import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { Routes, Route, useMatch, useNavigate } from 'react-router'
import { studioRoutes } from '@/config/routes'
import { CreateEditChannelView, UploadEditVideoActionSheet } from '@/views/studio'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { Button } from '@/shared/components'

const routesMap = [
  { path: studioRoutes.newChannel(), Component: <CreateEditChannelView newChannel /> },
  { path: studioRoutes.editChannel(), Component: <CreateEditChannelView /> },
]

const StudioRouter = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const uploadVideoMatch = useMatch({ path: `${studioRoutes.uploadVideo()}` })
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setIsMinimized(true)
    }, parseInt(transitions.timings.routing))
  }, [])
  console.log(uploadVideoMatch)
  return (
    <>
      {/* TODO: remove later */}
      <Button
        onClick={() => {
          navigate(studioRoutes.uploadVideo())
        }}
      >
        Open upload video sheet
      </Button>
      <Routes>
        {routesMap.map(({ path, Component }) => (
          <Route key={path} path={path} element={Component} />
        ))}
      </Routes>
      <CSSTransition
        timeout={parseInt(transitions.timings.routing)}
        classNames={transitions.names.slideUp}
        in={!!uploadVideoMatch}
        appear
        mountOnEnter
        unmountOnExit={false}
      >
        <UploadEditVideoActionSheet />
      </CSSTransition>
    </>
  )
}

export default StudioRouter
