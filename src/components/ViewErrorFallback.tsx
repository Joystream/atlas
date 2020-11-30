import React from 'react'
import styled from '@emotion/styled'
import { FallbackRender } from '@sentry/react/dist/errorboundary'

import { ReactComponent as ErrorIllustration } from '@/assets/error.svg'
import { Button, Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'

const Container = styled.div`
  margin: ${sizes(20)} auto 0;
  display: grid;
  place-items: center;

  > svg {
    max-width: 650px;
  }
`

const Message = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 90px;
  margin-bottom: ${sizes(10)};
`

const Title = styled(Text)`
  line-height: 1.25;
`

const Subtitle = styled(Text)`
  line-height: 1.75;
  color: ${colors.gray[300]};
`

const ErrorFallback: FallbackRender = ({ error, componentStack, resetError }) => {
  console.error('An error occurred.', { componentStack, error })
  return (
    <Container>
      <ErrorIllustration />
      <Message>
        <Title variant="h3">Oops! An Error occurred.</Title>
        <Subtitle>We could not acquire expected results. Please try reloading or return to the home page.</Subtitle>
      </Message>
      <Button onClick={resetError}>Return to home page</Button>
    </Container>
  )
}

export default ErrorFallback
