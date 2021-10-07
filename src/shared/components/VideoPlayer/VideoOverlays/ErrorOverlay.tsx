import React from 'react'

import { JOYSTREAM_DISCORD_URL } from '@/config/urls'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'

import { AnimationWrapper, ButtonGroup, StyledAnimatedError, StyledDiscordButton } from './ErrorOverlay.style'
import { InnerContainer, OverlayBackground, OverlayContent, OverlayHeading } from './VideoOverlays.style'

export const ErrorOverlay: React.FC = () => {
  const xsMatch = useMediaMatch('xs')
  return (
    <OverlayBackground>
      <InnerContainer>
        <AnimationWrapper>
          <StyledAnimatedError />
        </AnimationWrapper>
        <OverlayHeading variant={xsMatch ? 'h3' : 'h5'}>Aw, shucks!</OverlayHeading>
        <OverlayContent variant={xsMatch ? 'body1' : 'body2'} secondary>
          The video could not be played because the data is corrupted or the encoding is not supported. This issue has
          been logged. If you need support, reach out to our community on Discord.
        </OverlayContent>
        <ButtonGroup>
          <StyledDiscordButton size={xsMatch ? 'medium' : 'small'} variant="secondary" to={JOYSTREAM_DISCORD_URL}>
            Open Discord
          </StyledDiscordButton>
          <Button size={xsMatch ? 'medium' : 'small'} onClick={() => window.location.reload()}>
            Refresh the page
          </Button>
        </ButtonGroup>
      </InnerContainer>
    </OverlayBackground>
  )
}
