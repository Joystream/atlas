import React from 'react'

import { JOYSTREAM_DISCORD_URL } from '@/config/urls'

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

export const ErrorOverlay: React.FC = () => {
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
          <StyledDiscordButton variant="secondary" to={JOYSTREAM_DISCORD_URL}>
            Open Discord
          </StyledDiscordButton>
          <Button onClick={() => window.location.reload()}>Refresh the page</Button>
        </ButtonGroup>
      </InnerContainer>
    </OverlayBackground>
  )
}
