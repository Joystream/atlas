import styled from '@emotion/styled'
import { FallbackRender } from '@sentry/react/dist/errorboundary'
import React from 'react'

import { Button, Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'

const Container = styled.div`
  padding: ${sizes(4)};
  color: ${colors.gray[400]};
  display: grid;
  place-items: center;
`

const StyledButton = styled(Button)`
  color: ${colors.white};
`
type FallbackProps = Partial<Parameters<FallbackRender>[0]>

export const ErrorFallback: React.FC<FallbackProps> = ({ error, componentStack, resetError }) => {
  console.error(`An error occurred in ${componentStack}`)
  console.error(error)
  return (
    <Container>
      <Text>Something went wrong...</Text>
      <StyledButton variant="tertiary" onClick={resetError}>
        Try again
      </StyledButton>
    </Container>
  )
}
