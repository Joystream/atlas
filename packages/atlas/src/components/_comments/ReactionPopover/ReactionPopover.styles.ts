import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

export const ReactionPopoverWrapper = styled.div`
  position: relative;
  top: 0;
  left: 0;
`

export const ReactionPopoverInnerWrapper = styled.div<{ isVisible: boolean }>`
  border-radius: 999px;
  min-height: 48px;
  position: relative;
  clip-path: ${({ isVisible }) => (isVisible ? 'inset(0 0)' : 'inset(0 54px round 999px)')};
  width: 100%;
  background: ${cVar('colorBackgroundStrong')};
  display: grid;
  gap: ${sizes(1)};
  grid-auto-flow: column;
  padding: ${sizes(1)};
  align-items: center;
  overflow: hidden;
  transition: clip-path ${cVar('animationTransitionMedium')};

  ${media.sm} {
    clip-path: ${({ isVisible }) => (isVisible ? 'inset(0 0)' : 'inset(0 74px round 999px)')};
    min-height: 40px;
  }
`

export const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 16px;
  max-height: 16px;

  @media not screen and (min-device-pixel-ratio: 2), not screen and (min-resolution: 192dpi) {
    transform: translateX(-2px);
  }
`

export const Emojiis = styled.div`
  position: absolute;
  top: 0;
  display: grid;
  gap: ${sizes(1)};
  left: calc(-50% - 12px);
  grid-auto-flow: column;
`

export const StyledEmojiButton = styled(Button)<{ isVisible: boolean; verticalTranslate: number }>`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible, verticalTranslate }) =>
    isVisible ? 'translateY(0)' : `translateY(${verticalTranslate}px) `};
  transform-origin: right;
  position: relative;
  transition: all ${cVar('animationTransitionMedium')};
`
