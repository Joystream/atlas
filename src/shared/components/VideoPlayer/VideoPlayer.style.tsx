import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgPlayerSoundOff } from '@/shared/icons'

import { colors, media, sizes, transitions, zIndex } from '../../theme'
import { Text } from '../Text'

type ContainerProps = {
  isInBackground?: boolean
  isFullScreen?: boolean
}
type CustomControlsProps = {
  isFullScreen?: boolean
}

const focusStyles = css`
  :focus {
    /* Provide a fallback style for browsers
     that don't support :focus-visible e.g safari */
    box-shadow: inset 0 0 0 3px ${colors.transparentPrimary[18]};
  }

  /* https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible */

  :focus-visible {
    box-shadow: inset 0 0 0 3px ${colors.transparentPrimary[18]};
  }

  :focus:not(:focus-visible) {
    box-shadow: unset;
  }
`

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
  height: 2.5em;
  bottom: ${({ isFullScreen }) => (isFullScreen ? '2.5em' : '1em')};
  padding: 0 1em;
  left: 0;
  display: flex;
  align-items: flex-end;
  width: 100%;
  opacity: 0;
  transition: transform 200ms ${transitions.easing}, opacity 200ms ${transitions.easing};
`

export const ControlButton = styled.button`
  margin-right: 0.5em;
  cursor: pointer;
  border: none;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  transition: background-color ${transitions.timings.player} ${transitions.easing} !important;

  & > svg {
    filter: drop-shadow(0 1px 2px ${colors.transparentBlack[32]});
    width: 1.5em;
    height: 1.5em;
  }

  :hover {
    background-color: ${colors.transparentPrimary[18]};
    backdrop-filter: blur(${sizes(8)});
  }

  :active {
    background-color: ${colors.transparentPrimary[10]};
  }

  ${focusStyles}
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
export const VolumeButton = styled(ControlButton)`
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
  height: 100%;
  color: ${colors.white};
  margin-left: 1em;
  text-shadow: 0 1px 2px ${colors.transparentBlack[32]};
  align-items: center;
  font-feature-settings: 'tnum' on, 'lnum' on;
`

export const CurrentTime = styled(Text)`
  /* 14px */
  font-size: 0.875em;
`

export const ScreenControls = styled.div`
  margin-left: auto;

  ${ControlButton}:last-of-type {
    margin-right: 0;
  }
`

export const ControlsIndicatorWrapper = styled.div`
  position: absolute;
  top: calc(50% - ${sizes(16)});
  left: calc(50% - ${sizes(16)});
  display: flex;
  flex-direction: column;
`

export const ControlsIndicator = styled.div`
  width: ${sizes(32)};
  height: ${sizes(32)};
  backdrop-filter: blur(${sizes(6)});
  background-color: ${colors.transparentBlack[54]};
  border-radius: 100%;
  display: flex;
  transform: scale(0.5);
  justify-content: center;
  align-items: center;

  > svg {
    transform: scale(0.75);
    width: ${sizes(18)};
    height: ${sizes(18)};
  }
`

export const ControlsIndicatorTooltip = styled.div`
  user-select: none;
  display: none;
  align-self: center;
  background-color: ${colors.transparentBlack[54]};
  padding: ${sizes(2)};
  text-align: center;
  margin-top: ${sizes(3)};
  backdrop-filter: blur(${sizes(8)});

  ${media.small} {
    display: block;
  }
`

const animationEasing = 'cubic-bezier(0, 0, 0.3, 1)'

export const indicatorTransitions = css`
  .indicator-exit {
    opacity: 1;
  }

  .indicator-exit-active {
    ${ControlsIndicator} {
      transform: scale(1);
      opacity: 0;
      transition: transform 750ms ${animationEasing}, opacity 600ms 150ms ${animationEasing};

      > svg {
        transform: scale(1);
        transition: transform 750ms ${animationEasing};
      }
    }
    ${ControlsIndicatorTooltip} {
      opacity: 0;
      transition: transform 750ms ${animationEasing}, opacity 600ms 150ms ${animationEasing};
    }
  }
`

const backgroundContainerCss = css`
  .vjs-waiting .vjs-loading-spinner {
    display: none;
  }

  .vjs-control-bar {
    display: none;
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
  ${indicatorTransitions}

  position: relative;
  height: 100%;

  [class^='vjs'] {
    font-size: ${({ isFullScreen }) => (isFullScreen ? sizes(8) : sizes(4))} !important;
  }

  .video-js {
    background-color: ${colors.gray[900]};
  }

  .vjs-playing:hover ${CustomControls} {
    transform: translateY(-0.5em);
    opacity: 1;
  }
  .vjs-paused ${CustomControls} {
    transform: translateY(-0.5em);
    opacity: 1;
  }

  .vjs-user-inactive.vjs-playing > ${CustomControls} {
    transform: translateY(0.5em);
    opacity: 0;
  }

  .vjs-playing:hover ${ControlsOverlay} {
    opacity: 1;
  }
  .vjs-paused ${ControlsOverlay} {
    opacity: 1;
  }
  .vjs-user-inactive.vjs-playing > ${ControlsOverlay} {
    opacity: 0;
  }

  .vjs-poster {
    background-size: cover;
  }

  .vjs-control-bar {
    opacity: 0;
    background: none;
    align-items: flex-end;
    height: 2em;
    z-index: ${zIndex.overlay};
    transition: opacity 200ms ${transitions.easing} !important;

    :hover {
      & ~ ${CustomControls} {
        opacity: 0;
        transform: translateY(0.5em);
      }
    }

    .vjs-progress-control {
      height: 2em;
      z-index: ${zIndex.overlay};
      position: absolute;
      top: initial;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: ${({ isFullScreen }) => (isFullScreen ? `1.5em 1.5em` : `0 0.5em`)} !important;

      .vjs-slider {
        align-self: flex-end;
        height: 0.25em;
        margin: 0;
        background-color: ${colors.transparentWhite[32]};
        transition: height ${transitions.timings.player} ${transitions.easing} !important;

        ${focusStyles}

        .vjs-slider-bar {
          background-color: ${colors.blue[500]};
        }

        /* ::before is progress timeline thumb */

        .vjs-play-progress::before {
          content: '';
          position: absolute;
          box-shadow: 0 1px 2px ${colors.transparentBlack[32]};
          opacity: 0;
          border-radius: 100%;
          background: ${colors.white};
          right: -0.5em;
          height: 1em;
          width: 1em;
          top: -0.25em;
          transition: opacity ${transitions.timings.player} ${transitions.easing};
        }

        .vjs-play-progress {
          .vjs-time-tooltip {
            display: none;
          }
        }

        .vjs-load-progress {
          background-color: ${colors.transparentWhite[32]};

          > div {
            display: none;
          }
        }
      }

      :hover .vjs-play-progress::before {
        opacity: 1;
      }

      :hover .vjs-slider {
        height: 0.5em;
      }
    }
  }

  :hover .vjs-control-bar {
    opacity: 1;
  }

  .vjs-paused .vjs-control-bar {
    opacity: 1;
  }

  ${({ isInBackground }) => isInBackground && backgroundContainerCss};
`

export const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.overlay};
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
