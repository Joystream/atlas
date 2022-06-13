import { FC } from 'react'

import { Button } from '@/components/_buttons/Button'
import { JOYSTREAM_DISCORD_URL } from '@/config/urls'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { AnimationWrapper, ButtonGroup, StyledAnimatedError, StyledDiscordButton } from './ErrorOverlay.styles'
import { InnerContainer, OverlayBackground, OverlayContent, OverlayHeading } from './VideoOverlays.styles'

export const ErrorOverlay: FC = () => {
  const smMatch = useMediaMatch('sm')
  return (
    <OverlayBackground>
      <InnerContainer>
        <AnimationWrapper>
          <StyledAnimatedError />
        </AnimationWrapper>
        <OverlayHeading as="h3" variant={smMatch ? 'h600' : 'h400'}>
          Aw, shucks!
        </OverlayHeading>
        <OverlayContent as="p" variant={smMatch ? 't300' : 't200'} color="default">
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
