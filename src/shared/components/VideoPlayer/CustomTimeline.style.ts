import styled from '@emotion/styled'

import { colors, transitions, zIndex } from '@/shared/theme'

import { CustomControls } from './VideoPlayer.style'

import { Text } from '../Text'

type ProgressControlProps = {
  isFullScreen?: boolean
}

export const ProgressControl = styled.div<ProgressControlProps>`
  padding: ${({ isFullScreen }) => (isFullScreen ? `1.5em 1.5em` : `0`)};
  position: absolute;
  height: 1.5em;
  z-index: ${zIndex.nearOverlay};
  left: 0;
  bottom: 0;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
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
  }
  :hover ~ ${CustomControls} {
    opacity: 0;
    transform: translateY(0.5em) !important;
  }
`

export const SeekBar = styled.div`
  position: relative;
  width: 100%;
  height: 0.25em;
  background-color: ${colors.transparentWhite[32]};
  transition: height ${transitions.timings.player} ${transitions.easing};
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
  position: absolute;
  padding: ${({ isFullScreen }) => (isFullScreen ? `0` : `0 1em`)};
  bottom: 1.5em;
  transition: transform 200ms ${transitions.easing};
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
  width: 1em;
  top: -0.25em;
  position: absolute;
  box-shadow: 0 1px 2px ${colors.transparentBlack[32]};
  border-radius: 100%;
  background: ${colors.white} !important;
  transition: opacity ${transitions.timings.player} ${transitions.easing};
`
