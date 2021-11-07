import React from 'react'

import { Button } from '@/components/Button'
import { JOYSTREAM_DISCORD_URL } from '@/config/urls'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { AnimationWrapper, ButtonGroup, StyledAnimatedError, StyledDiscordButton } from './ErrorOverlay.style'
import { InnerContainer, OverlayBackground, OverlayContent, OverlayHeading } from './VideoOverlays.style'

export const ErrorOverlay: React.FC = () => {
  const smMatch = useMediaMatch('sm')
  return (
    <OverlayBackground>
      <InnerContainer>
        <AnimationWrapper>
          <StyledAnimatedError />
        </AnimationWrapper>
        <OverlayHeading variant={smMatch ? 'h3' : 'h5'}>Aw, shucks!</OverlayHeading>
        <OverlayContent variant={smMatch ? 'body1' : 'body2'} secondary>
          The video could not be played because the data is corrupted or the encoding is not supported. This issue has
          been logged. If you need support, reach out to our community on Discord.
        </OverlayContent>
        <ButtonGroup>
          <StyledDiscordButton size={smMatch ? 'medium' : 'small'} variant="secondary" to={JOYSTREAM_DISCORD_URL}>
            Open Discord
          </StyledDiscordButton>
          <Button size={smMatch ? 'medium' : 'small'} onClick={() => window.location.reload()}>
            Refresh the page
          </Button>
        </ButtonGroup>
      </InnerContainer>
    </OverlayBackground>
  )
}
