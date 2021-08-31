import styled from '@emotion/styled'
import { FallbackRender } from '@sentry/react/dist/errorboundary'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { absoluteRoutes } from '@/config/routes'
import { JOYSTREAM_DISCORD_URL } from '@/config/urls'
import { AnimatedError } from '@/shared/components/AnimatedError'
import { Button } from '@/shared/components/Button'
import { Text } from '@/shared/components/Text'
import { media, sizes } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

// this isn't a react component, just a function that will be executed once to get a react element
export const ViewErrorBoundary: FallbackRender = ({ error, resetError }) => {
  SentryLogger.error('Unhandled exception was thrown', 'ErrorBoundary', error)
  return <ViewErrorFallback onResetClick={resetError} />
}

type ViewErrorFallbackProps = {
  onResetClick?: () => void
}

export const ViewErrorFallback: React.FC<ViewErrorFallbackProps> = ({ onResetClick }) => {
  const navigate = useNavigate()

  const handleResetClick = () => {
    if (onResetClick) {
      onResetClick()
    } else {
      navigate(absoluteRoutes.viewer.index())
    }
  }

  return (
    <Container>
      <AnimatedError />
      <Message>
        <Header variant="h3">Oops! An error occurred.</Header>
        <Text variant="body1" secondary>
          Something bad happened and the app broke. This has been logged and we&apos;ll try to resolve it as soon as
          possible. You can find support in our Discord community.
        </Text>
      </Message>
      <ButtonsContainer>
        <Button to={JOYSTREAM_DISCORD_URL} variant="secondary">
          Open Discord
        </Button>
        <Button onClick={handleResetClick}>Return to home page</Button>
      </ButtonsContainer>
    </Container>
  )
}

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
  margin-top: 50px;
  ${media.sm} {
    max-width: 70%;
  }
`

const Header = styled(Text)`
  margin-bottom: ${sizes(2)};
`

const ButtonsContainer = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 16px;
`
