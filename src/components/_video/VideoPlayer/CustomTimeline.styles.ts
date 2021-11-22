import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { media, oldColors, transitions, zIndex } from '@/styles'

import { CustomControls, TRANSITION_DELAY } from './VideoPlayer.styles'

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

  @media (hover: hover) {
    cursor: pointer;
    padding: ${({ isFullScreen }) => (isFullScreen ? `1.5em 1.5em` : `0`)};
    ${({ isScrubbing, isFullScreen }) => isScrubbing && scrubbingStyles(isFullScreen)};

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
      transform: translateY(-0.5em);
      opacity: 1;
    }
    :hover ~ ${CustomControls} {
      opacity: 0;
      transform: translateY(0.5em);
    }
  }

  :active {
    ${() => PlayProgressThumb} {
      ${({ isScrubbing }) => isScrubbing && `opacity: 1;`}
    }
  }

  ${() => MouseDisplayWrapper}, ${() => PlayProgressThumb} {
    ${({ isScrubbing }) => isScrubbing && `opacity: 1;`}
  }
  ${() => MouseDisplayTooltip} {
    ${({ isScrubbing }) => isScrubbing && `transform: translateY(-0.5em); opacity: 1;`}
  }
  ${() => SeekBar} {
    ${({ isScrubbing }) => isScrubbing && `height: 0.5em;`}
  }
  ~ ${CustomControls} {
    ${({ isScrubbing }) => isScrubbing && `opacity: 0; transform: translateY(0.5em);`}
  }
`

export const SeekBar = styled.div`
  position: relative;
  width: 100%;
  background-color: ${oldColors.transparentWhite[32]};
  transition: height ${transitions.timings.player} ${TRANSITION_DELAY} ${transitions.easing};
  height: 0.5em;
  ${media.xs} {
    height: 0.25em;
  }
`

export const LoadProgress = styled.div`
  height: 100%;
  background-color: ${oldColors.transparentWhite[32]};
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
  background-color: ${oldColors.transparentWhite[32]};
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
  text-shadow: 0 1px 2px ${oldColors.transparentBlack[32]};
  font-feature-settings: 'tnum' on, 'lnum' on;
`

export const PlayProgressWrapper = styled.div`
  width: 100%;
`

export const PlayProgress = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  background-color: ${oldColors.blue[500]};
  z-index: 1;
`

export const PlayProgressThumb = styled.button`
  border: none;
  opacity: 0;
  z-index: 1;
  content: '';
  padding: 0;
  position: absolute;
  box-shadow: 0 1px 2px ${oldColors.transparentBlack[32]};
  border-radius: 100%;
  background: ${oldColors.white};
  transition: opacity ${transitions.timings.player} ${TRANSITION_DELAY} ${transitions.easing};
  top: -0.75em;
  height: 2em;
  width: 2em;
  ${media.xs} {
    cursor: pointer;
    top: -0.25em;
    height: 1em;
    width: 1em;
  }
`
