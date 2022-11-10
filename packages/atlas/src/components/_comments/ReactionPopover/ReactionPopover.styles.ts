import styled from '@emotion/styled'

import { SvgActionPlaceholder } from '@/assets/icons'
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

export const StyledEmojiButton = styled(Button)<{ isVisible: boolean; verticalTranslate: number }>`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible, verticalTranslate }) =>
    isVisible ? 'translateY(0)' : `translateY(${verticalTranslate}px) `};
  transform-origin: right;
  position: relative;
  transition: all ${cVar('animationTransitionMedium')};
`

export const StyledSvgActionPlaceholder = styled(SvgActionPlaceholder)`
  path {
    fill: ${cVar('colorText')};
  }
`
