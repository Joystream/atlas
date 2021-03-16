import styled from '@emotion/styled'
import React from 'react'
import { Route } from 'react-router'
import { MyVideosView } from '..'

const routesMap = [{ path: './videos', Component: MyVideosView }]

const StudioRouter = () => {
  return (
    <>
      <Container>
        {routesMap.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Container>
    </>
  )
}

export default StudioRouter

const Container = styled.div`
  --max-inner-width: calc(1440px - var(--sidenav-collapsed-width) - var(--global-horizontal-padding));
  max-width: var(--max-inner-width);
  margin: 0 auto;
`
