import React from 'react'

import {
  AnimationWrapper,
  ButtonGroup,
  ErrorMessage,
  Heading,
  InnerContainer,
  OverlayBackground,
  StyledAnimatedError,
  StyledDiscordButton,
} from './ErrorOverlay.style'

import { Button } from '../../Button'

export const ErrorOverlay = () => {
  return (
    <OverlayBackground>
      <InnerContainer>
        <AnimationWrapper>
          <StyledAnimatedError />
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
