import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgPlayerSoundOff } from '@/shared/icons'

import { PlayerControlButton } from './PlayerControlButton'
import { ControlButton } from './PlayerControlButton.style'

import { colors, sizes, transitions, zIndex } from '../../theme'
import { Text } from '../Text'

type ContainerProps = {
  isInBackground?: boolean
  isFullScreen?: boolean
}
type CustomControlsProps = {
  isFullScreen?: boolean
  isEnded?: boolean
}

export const ControlsOverlay = styled.div<CustomControlsProps>`
  font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(8) : sizes(4))};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(180deg, transparent 0%, ${colors.gray[900]} 100%);
  height: 8em;
  transition: opacity 200ms ${transitions.easing}, visibility 200ms ${transitions.easing};
`

export const CustomControls = styled.div<CustomControlsProps>`
  font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(8) : sizes(4))};
  position: absolute;
  bottom: ${({ isFullScreen }) => (isFullScreen ? '2.5em' : '1em')};
  padding: 0.5em 1em 0;
  border-top: ${({ isEnded }) => (isEnded ? `1px solid ${colors.transparentPrimary[18]}` : 'unset')};
  left: 0;
  display: flex;
  align-items: center;
  z-index: ${zIndex.nearOverlay - 1};
  width: 100%;
  transition: transform 200ms ${transitions.easing}, opacity 200ms ${transitions.easing};
`

export const VolumeSliderContainer = styled.div`
  display: flex;
  align-items: center;
`

export const thumbStyles = css`
  appearance: none;
  border: none;
  background: ${colors.white};
  width: 0.75em;
  height: 0.75em;
  border-radius: 100%;
  cursor: pointer;
`

export const VolumeSlider = styled.input`
  appearance: none;
  border-radius: 2px;
  margin: 0;
  padding: 0;
  width: 4em;
  height: 0.25em;
  background: linear-gradient(
    to right,
    ${colors.white} 0%,
    ${colors.white} ${({ value }) => (value ? Number(value) * 100 : 0)}%,
    ${colors.transparentWhite[32]} 30%,
    ${colors.transparentWhite[32]} 100%
  );
  outline: none;
  opacity: 0;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform ${transitions.timings.player} ${transitions.easing},
    opacity ${transitions.timings.player} ${transitions.easing};

  ::-moz-range-thumb {
    ${thumbStyles};
  }

  ::-webkit-slider-thumb {
    ${thumbStyles};
  }
`

export const VolumeControl = styled.div`
  display: flex;
  border-radius: 1.25em;
  width: 2.5em;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing},
    width ${transitions.timings.sharp} ${transitions.easing};

  :hover {
    background-color: ${colors.transparentPrimary[18]};
    backdrop-filter: blur(${sizes(8)});
    width: 7.5em;
    ${VolumeSlider} {
      opacity: 1;
      transform: scaleX(1);
    }
  }
`
export const VolumeButton = styled(PlayerControlButton)`
  cursor: pointer;
  margin-right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    /* already set by VolumeControl */
    background-color: unset;
    backdrop-filter: unset;
  }
`

export const StyledSvgPlayerSoundOff = styled(SvgPlayerSoundOff)`
  opacity: 0.5;
`
export const CurrentTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 2.5em;
  margin-left: 1em;
`

export const CurrentTime = styled(Text)`
  /* 14px */
  font-size: 0.875em;
  color: ${colors.white};
  text-shadow: 0 1px 2px ${colors.transparentBlack[32]};
  font-feature-settings: 'tnum' on, 'lnum' on;
`

export const ScreenControls = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5em;
  margin-left: auto;

  ${ControlButton}:last-of-type {
    margin-right: 0;
  }
`

const backgroundContainerCss = css`
  .vjs-waiting .vjs-loading-spinner {
    display: none;
  }

  .vjs-error-display {
    display: block;
  }

  .vjs-poster {
    display: block !important;
    opacity: 0;
    transition: opacity ${transitions.timings.loading} ${transitions.easing};
  }

  .vjs-ended .vjs-poster,
  .vjs-paused:not(.vjs-has-started) .vjs-poster {
    opacity: 1;
  }
`

export const Container = styled.div<ContainerProps>`
  position: relative;
  height: 100%;
  z-index: 0;

  [class^='vjs'] {
    font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(8) : sizes(4))} !important;
  }

  .video-js {
    background-color: ${colors.gray[900]};
  }

  .vjs-error-display,
  .vjs-control-bar {
    display: none;
  }

  .vjs-playing:hover {
    ${ControlsOverlay} {
      opacity: 1;
      ${CustomControls} {
        transform: translateY(-0.5em);
      }
    }
  }

  .vjs-user-inactive.vjs-playing {
    ${ControlsOverlay} {
      opacity: 0;
      ${CustomControls} {
        transform: translateY(0.5em);
      }
    }
  }

  .vjs-paused {
    ${ControlsOverlay} {
      opacity: 1;
      ${CustomControls} {
        transform: translateY(-0.5em);
      }
    }
  }

  .vjs-poster {
    background-size: cover;
  }

  ${({ isInBackground }) => isInBackground && backgroundContainerCss};
`

export const BigPlayButtonOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.overlay};
  background: ${colors.transparentBlack[86]};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BigPlayButton = styled(ControlButton)`
  display: flex !important;
  width: ${sizes(20)};
  height: ${sizes(20)};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  background-color: ${colors.transparentPrimary[18]} !important;
  backdrop-filter: blur(${sizes(8)}) !important;

  > svg {
    width: ${sizes(10)} !important;
    height: ${sizes(10)} !important;
  }
`
