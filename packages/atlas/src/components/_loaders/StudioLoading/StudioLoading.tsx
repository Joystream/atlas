import styled from '@emotion/styled'
import { FC } from 'react'

import { Text } from '@/components/Text'
import { Spinner } from '@/components/_loaders/Spinner'
import { atlasConfig } from '@/config'
import { sizes } from '@/styles'

export const StudioLoading: FC = () => {
  return (
    <LoadingStudioContainer>
      <Spinner size="large" />
      <Text as="span" variant="h700">
        Loading {atlasConfig.general.appName} Studio...
      </Text>
    </LoadingStudioContainer>
  )
}

export const LoadingStudioContainer = styled.main`
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
