import React from 'react'
import styled from '@emotion/styled'
import { Spinner, Text } from '@/shared/components'
import { TOP_NAVBAR_HEIGHT } from '@/components'

export const LoadingStudio = () => {
  return (
    <LoadingStudioContainer>
      <Text variant="h1">Loading Studio View</Text>
      <Spinner />
    </LoadingStudioContainer>
  )
}

const LoadingStudioContainer = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  padding: ${TOP_NAVBAR_HEIGHT}px var(--global-horizontal-padding) 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    margin-top: 24px;
  }
`
