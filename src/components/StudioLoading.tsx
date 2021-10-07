import styled from '@emotion/styled'
import React from 'react'

import { Spinner } from '@/shared/components/Spinner'
import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'

export const StudioLoading: React.FC = () => {
  return (
    <LoadingStudioContainer>
      <Spinner size="large" />
      <Text variant="h2">Loading Joystream Studio...</Text>
    </LoadingStudioContainer>
  )
}

const LoadingStudioContainer = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  padding: var(--size-topbar-height) var(--size-global-horizontal-padding) 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-top: ${sizes(12)};
  }
`
