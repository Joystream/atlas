import styled from '@emotion/styled'
import React from 'react'

import { TOP_NAVBAR_HEIGHT } from '@/components/TopbarBase'
import { Spinner } from '@/shared/components/Spinner'
import { Text } from '@/shared/components/Text'

export const StudioLoading: React.FC = () => {
  return (
    <LoadingStudioContainer>
      <Text variant="h1">Loading Joystream studio...</Text>
      <Spinner size="large" />
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
