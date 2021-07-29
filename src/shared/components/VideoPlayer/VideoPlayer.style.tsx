import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgPlayerSoundOff } from '@/shared/icons'

import { PlayerControlButton } from './PlayerControlButton'
import { ControlButton } from './PlayerControlButton.style'

import { colors, media, sizes, transitions, zIndex } from '../../theme'
import { Text } from '../Text'

type ContainerProps = {
  isInBackground?: boolean
  isFullScreen?: boolean
}
type CustomControlsProps = {
  isFullScreen?: boolean
  isEnded?: boolean
}

export const TRANSITION_DELAY = '50ms'

export const ControlsOverlay = styled.div<CustomControlsProps>`
  font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(6) : sizes(4))};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: ${colors.transparentBlack[54]};
  height: 100%;
  visibility: hidden;
  z-index: ${zIndex.nearOverlay - 1};
  transition: opacity 200ms ${TRANSITION_DELAY} ${transitions.easing},
    visibility 200ms ${TRANSITION_DELAY} ${transitions.easing};
  ${media.compact} {
    height: 8em;
    background: linear-gradient(180deg, transparent 0%, ${colors.gray[900]} 100%);
  }

  @media (hover: hover) {
    font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(8) : sizes(4))};
  }
`

export const CustomControls = styled.div<CustomControlsProps>`
  position: absolute;
  bottom: ${({ isFullScreen }) => (isFullScreen ? '2.5em' : '1em')};
  padding: 0.5em 0.5em 0;
  border-top: ${({ isEnded }) => (isEnded ? `1px solid ${colors.transparentPrimary[18]}` : 'unset')};
  left: 0;
  display: flex;
  width: 100%;
  transition: transform 200ms ${TRANSITION_DELAY} ${transitions.easing},
    opacity 200ms ${TRANSITION_DELAY} ${transitions.easing};
  top: ${({ isEnded }) => (isEnded ? 'unset' : 0)};
  align-items: flex-end;
  ${media.compact} {
    padding: 0.5em 1em 0;
    top: unset;
    align-items: center;
    height: unset;
  }
`

export const PlayControl = styled.div`
  align-self: center;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  ${media.compact} {
    margin-right: 0.5em;
    align-self: unset;
    width: unset;
    left: unset;
    position: unset;
  }
`

type StyledPlayButtonProps = {
  isEnded?: boolean
}

export const PlayButton = styled(PlayerControlButton)<StyledPlayButtonProps>`
  ${media.compact} {
    display: flex !important;
  }

  svg {
    width: ${({ isEnded }) => (isEnded ? '1.5em' : '2.5em')};
    height: ${({ isEnded }) => (isEnded ? '1.5em' : '2.5em')};
    ${media.compact} {
      width: 1.5em;
      height: 1.5em;
    }
  }
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
  cursor: pointer;
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
  /* hide volume control on devices which dont support :hover i.e. mobiles, tablets */
  display: none;
  border-radius: 1.25em;
  width: 2.5em;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing},
    width ${transitions.timings.sharp} ${transitions.easing};

  @media (hover: hover) {
    display: flex;

    :hover {
      background-color: ${colors.transparentPrimary[18]};
      backdrop-filter: blur(${sizes(8)});
      width: 7.5em;
      ${VolumeSlider} {
        opacity: 1;
        transform: scaleX(1);
      }
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
  margin-left: 0.5em;
  ${media.compact} {
    margin-left: 1em;
  }
`

export const CurrentTime = styled(Text)`
  /* 14px */
  font-size: 0.875em;
  user-select: none;
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
      visibility: visible;
      ${CustomControls} {
        transform: translateY(-0.5em);
      }
    }
  }

  .vjs-user-inactive.vjs-playing {
    ${ControlsOverlay} {
      opacity: 0;
      visibility: hidden;
      ${CustomControls} {
        transform: translateY(0.5em);
      }
    }
  }

  .vjs-ended,
  .vjs-paused,
  .vjs-user-active {
    ${ControlsOverlay} {
      opacity: 1;
      visibility: visible;
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
  position: absolute;
  background-color: ${colors.transparentPrimary[18]} !important;
  backdrop-filter: blur(${sizes(8)}) !important;

  > svg {
    width: ${sizes(10)} !important;
    height: ${sizes(10)} !important;
  }
  ${media.compact} {
    cursor: pointer;
  }
`
