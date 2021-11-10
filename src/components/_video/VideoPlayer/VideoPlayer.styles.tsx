import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgPlayerSoundOff } from '@/components/_icons'
import { colors, media, sizes, transitions, zIndex } from '@/theme'

import { PlayerControlButton } from './PlayerControlButton'
import { ControlButton } from './PlayerControlButton.styles'

type ContainerProps = {
  isFullScreen?: boolean
}
type CustomControlsProps = {
  isFullScreen?: boolean
  isEnded?: boolean
}

export const TRANSITION_DELAY = '50ms'

export const ControlsOverlay = styled.div<CustomControlsProps>`
  font-size: ${sizes(4)};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: ${colors.transparentBlack[54]};
  height: 100%;
  visibility: hidden;
  transition: opacity, visibility;
  transition-delay: ${TRANSITION_DELAY};
  transition-duration: 200ms;
  transition-timing-function: ${transitions.easing};

  @media (hover: hover) {
    height: 8em;
    background: linear-gradient(180deg, transparent 0%, ${colors.gray[900]} 100%);
    font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(8) : sizes(4))};
  }
`

export const CustomControls = styled.div<CustomControlsProps>`
  position: absolute;
  transform: translateY(0.5em);
  padding: 0.5em 0.5em 0 0.5em;
  bottom: ${({ isFullScreen }) => (isFullScreen ? '2.5em' : '1.25em')};
  border-top: ${({ isEnded }) => (isEnded ? `1px solid ${colors.transparentPrimary[18]}` : 'unset')};
  left: 0;
  z-index: ${zIndex.nearOverlay - 1};
  display: flex;
  width: 100%;
  transition: opacity, transform;
  transition-duration: 200ms;
  transition-timing-function: ${transitions.easing};
  transition-delay: ${TRANSITION_DELAY};
  top: ${({ isEnded }) => (isEnded ? 'unset' : 0)};
  align-items: flex-end;
  @media (hover: hover) {
    padding: 0.5em 1em 0 1em;
    top: unset;
    align-items: center;
    height: unset;
  }
`
type PlayControlProps = {
  isLoading?: boolean
}

export const PlayControl = styled.div<PlayControlProps>`
  align-self: center;
  width: 100%;
  position: absolute;
  align-items: center;
  display: flex;
  justify-content: center;
  left: 0;

  /* hide PlayControl when loading on mobile */
  ${({ isLoading }) => isLoading && `opacity: 0;`}
  @media (hover: hover) {
    opacity: 1;
    margin-right: 0.5em;
    align-self: unset;
    width: unset;
    position: unset;
    transform: unset;
  }
`

type StyledPlayButtonProps = {
  isEnded?: boolean
}

export const PlayButton = styled(PlayerControlButton)<StyledPlayButtonProps>`
  @media (hover: hover) {
    display: flex;
  }

  svg {
    width: ${({ isEnded }) => (isEnded ? '1.5em' : '2.5em')};
    height: ${({ isEnded }) => (isEnded ? '1.5em' : '2.5em')};
    @media (hover: hover) {
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
  transition: opacity, transform;
  transition-duration: ${transitions.timings.player};
  transition-timing-function: ${transitions.easing};

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
  transition: background-color, width;
  transition-duration: ${transitions.timings.sharp};
  transition-timing-function: ${transitions.easing};

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
  @media (hover: hover) {
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
  gap: 0.25em;
  margin-left: auto;

  ${ControlButton}:last-of-type {
    margin-right: 0;
  }
  ${media.sm} {
    gap: 0.5em;
  }
`

export const Container = styled.div<ContainerProps>`
  position: relative;
  height: 100%;
  z-index: 0;

  .video-js {
    background-color: ${colors.gray[900]};
    position: relative;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  .vjs-tech {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .vjs-error-display,
  .vjs-text-track-display,
  .vjs-modal-dialog,
  .vjs-loading-spinner,
  .vjs-control-bar {
    display: none;
  }

  .vjs-user-inactive.vjs-playing,
  /* don't hide player controls when paused(mobile) */
  .vjs-user-inactive:not(.vjs-ended):not(.vjs-paused) {
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
  .vjs-user-active:not(.vjs-waiting) {
    ${ControlsOverlay} {
      opacity: 1;
      visibility: visible;
      ${CustomControls} {
        transform: translateY(0);
      }
    }
  }

  @media (hover: hover) {
    .vjs-user-active.vjs-playing {
      ${ControlsOverlay} {
        opacity: 0;
        visibility: hidden;
        ${CustomControls} {
          transform: translateY(0.5em);
        }
      }
    }

    .vjs-playing:hover {
      ${ControlsOverlay} {
        opacity: 1;
        visibility: visible;
        ${CustomControls} {
          transform: translateY(0);
        }
      }
    }

    .vjs-user-inactive.vjs-playing,
    .vjs-user-inactive.vjs-paused:not(.vjs-ended) {
      ${ControlsOverlay} {
        opacity: 0;
        visibility: hidden;
        ${CustomControls} {
          transform: translateY(0.5em);
        }
      }
    }
  }

  .vjs-poster {
    background-size: cover;
  }
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
  display: flex;
  width: ${sizes(20)};
  height: ${sizes(20)};
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${colors.transparentPrimary[18]};
  backdrop-filter: blur(${sizes(8)});

  > svg {
    width: ${sizes(10)};
    height: ${sizes(10)};
  }
  @media (hover: hover) {
    cursor: pointer;
  }
`
