import styled from '@emotion/styled'
import React from 'react'

import { AnimatedError } from '@/components/AnimatedError'
import { Loader } from '@/components/Loader'

export const Animations = () => {
  return (
    <Container>
      <Loader variant="xlarge" />
      <Loader variant="large" />
      <Loader variant="medium" />
      <Loader variant="small" />
      <Loader variant="xsmall" />
      <Loader variant="player" />
      <AnimatedError />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 32px;
  justify-content: center;
`
