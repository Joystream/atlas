import React, { useEffect, useState } from 'react'

import {
  AnimationWrapper,
  ButtonGroup,
  ErrorMessage,
  Heading,
  InnerContainer,
  OverlayBackground,
  StyledDiscordButton,
  StyledLottie,
} from './ErrorOverlay.style'

import { Button } from '../../Button'

export const ErrorOverlay = () => {
  const [errorAnimation, setErrorAnimation] = useState<object>()

  useEffect(() => {
    import('@/shared/animations/player-error.json').then(setErrorAnimation)
  }, [])

  return (
    <OverlayBackground>
      <InnerContainer>
        <AnimationWrapper>
          <StyledLottie animationData={errorAnimation} play loop={false}></StyledLottie>
        </AnimationWrapper>
        <Heading variant="h3">Aw, shucks!</Heading>
        <ErrorMessage variant="body1" secondary>
          The video could not be loaded because of an error. Please try again later. If the issue persists, reach out to
          our community on Discord.
        </ErrorMessage>
        <ButtonGroup>
          <StyledDiscordButton variant="secondary" to="https://discord.gg/DE9UN3YpRP">
            Open Discord
          </StyledDiscordButton>
          <Button onClick={() => window.location.reload()}>Refresh the page</Button>
        </ButtonGroup>
      </InnerContainer>
    </OverlayBackground>
  )
}
