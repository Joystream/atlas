import styled from '@emotion/styled'
import { FallbackRender } from '@sentry/react/dist/errorboundary'
import React from 'react'

import { Button, Text } from '@/shared/components'
import { SvgWellErrorIllustration } from '@/shared/illustrations'
import { colors, sizes } from '@/shared/theme'
import { Logger } from '@/utils/logger'

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

export const ErrorFallback: FallbackRender = ({ error, componentStack, resetError }) => {
  Logger.error('An error occurred.', { componentStack, error })
  return (
    <Container>
      <SvgWellErrorIllustration />
      <Message>
        <Title variant="h3">Oops! An Error occurred.</Title>
        <Subtitle>We could not acquire expected results. Please try reloading or return to the home page.</Subtitle>
      </Message>
      <Button onClick={resetError}>Return to home page</Button>
    </Container>
  )
}
