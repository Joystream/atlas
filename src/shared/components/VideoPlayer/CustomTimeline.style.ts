import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, transitions, zIndex } from '@/shared/theme'

import { CustomControls, TRANSITION_DELAY } from './VideoPlayer.style'

import { Text } from '../Text'

type ProgressControlProps = {
  isFullScreen?: boolean
  isScrubbing?: boolean
}

// expand ProgressControl area when scrubbing
const scrubbingStyles = (isFullScreen?: boolean) => css`
  height: 100vh;
  bottom: ${isFullScreen ? 0 : '-200px'};
  padding-bottom: ${isFullScreen ? `1.5em 1.5em` : '200px'};
`

export const ProgressControl = styled.div<ProgressControlProps>`
  padding: ${({ isFullScreen }) => (isFullScreen ? `1.5em 1em` : `0`)};
  position: absolute;
  height: 1.5em;
  z-index: ${zIndex.nearOverlay};
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: flex-end;

  ${media.compact} {
    cursor: pointer;
    @media (hover: hover) {
      padding: ${({ isFullScreen }) => (isFullScreen ? `1.5em 1.5em` : `0`)};
      ${({ isScrubbing, isFullScreen }) => isScrubbing && scrubbingStyles(isFullScreen)};
    }
  }

  :hover ${() => SeekBar} {
    height: 0.5em;
  }
  :hover ${() => PlayProgressThumb} {
    opacity: 1;
  }
  :hover ${() => MouseDisplayWrapper} {
    opacity: 1;
  }
  :hover ${() => MouseDisplayTooltip} {
    transform: translateY(-0.5em) !important;
    opacity: 1;
  }
  :hover ~ ${CustomControls} {
    opacity: 0;
    transform: translateY(0.5em) !important;
  }

  ${() => SeekBar} {
    ${({ isScrubbing }) => isScrubbing && `height: 0.5em`}
  }

  ${() => MouseDisplayWrapper}, ${() => PlayProgressThumb} {
    ${({ isScrubbing }) => isScrubbing && `opacity: 1`}
  }
  ${() => MouseDisplayTooltip} {
    ${({ isScrubbing }) => isScrubbing && `transform: translateY(-0.5em) !important`}
  }
  ~ ${CustomControls} {
    ${({ isScrubbing }) => isScrubbing && `opacity: 0; transform: translateY(0.5em) !important`};
  }
`

export const SeekBar = styled.div`
  position: relative;
  width: 100%;
  background-color: ${colors.transparentWhite[32]};
  transition: height ${transitions.timings.player} ${TRANSITION_DELAY} ${transitions.easing};
  height: 0.5em;
  ${media.compact} {
    height: 0.25em;
  }
`

export const LoadProgress = styled.div`
  height: 100%;
  background-color: ${colors.transparentWhite[32]};
`

export const MouseDisplayWrapper = styled.div`
  width: 100%;
  opacity: 0;
  transition: opacity 200ms ${transitions.easing};
`

export const MouseDisplay = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  background-color: ${colors.transparentWhite[32]};
`

type MouseDisplayTooltipProps = {
  isFullScreen?: boolean
}

export const MouseDisplayTooltip = styled.div<MouseDisplayTooltipProps>`
  pointer-events: none;
  user-select: none;
  opacity: 0;
  position: absolute;
  padding: ${({ isFullScreen }) => (isFullScreen ? `0` : `0 1em`)};
  bottom: 1.5em;
  transition: transform ${transitions.timings.player} ${TRANSITION_DELAY} ${transitions.easing},
    opacity ${transitions.timings.player} ${TRANSITION_DELAY} ${transitions.easing};
`

export const StyledTooltipText = styled(Text)`
  /* 14px */
  font-size: 0.875em;
  pointer-events: none;
  text-shadow: 0 1px 2px ${colors.transparentBlack[32]};
  font-feature-settings: 'tnum' on, 'lnum' on;
`

export const PlayProgressWrapper = styled.div`
  width: 100%;
`

export const PlayProgress = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  background-color: ${colors.blue[500]};
  z-index: 1;
`

export const PlayProgressThumb = styled.button`
  border: none;
  opacity: 0;
  z-index: 1;
  content: '';
  height: 1em;
  top: -0.25em;
  width: 1em;
  position: absolute;
  box-shadow: 0 1px 2px ${colors.transparentBlack[32]};
  border-radius: 100%;
  background: ${colors.white} !important;
  transition: opacity ${transitions.timings.player} ${TRANSITION_DELAY} ${transitions.easing} !important;
  ${media.compact} {
    cursor: pointer;
  }
`
