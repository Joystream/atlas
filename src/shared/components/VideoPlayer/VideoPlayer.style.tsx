import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgPlayerSoundOff } from '@/shared/icons'

import { colors, sizes, transitions, typography, zIndex } from '../../theme'
import { Text } from '../Text'

type ContainerProps = {
  isInBackground?: boolean
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

export const CustomControls = styled.div`
  position: absolute;
  height: 100%;
  bottom: ${sizes(5)};
  padding: 0 ${sizes(4)};
  left: 0;
  z-index: ${zIndex.overlay};
  display: flex;
  align-items: flex-end;
  width: 100%;
  opacity: 0;
  transition: transform 200ms ${transitions.easing}, opacity 200ms ${transitions.easing};
`

export const ControlButton = styled.button`
  margin-right: ${sizes(2)};
  cursor: pointer;
  border: none;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${sizes(2)};
  transition: background-color ${transitions.timings.player} ${transitions.easing} !important;

  & > svg {
    filter: drop-shadow(0 1px 2px ${colors.transparentBlack[32]});
  }

  :hover {
    background-color: ${colors.transparentPrimary[18]};
    backdrop-filter: blur(${sizes(8)});
  }

  ${focusStyles}
`

export const VolumeSliderContainer = styled.div`
  display: flex;
  align-items: center;
`

export const thumbStyles = css`
  border: none;
  background: ${colors.white};
  -webkit-appearance: none;
  appearance: none;
  width: ${sizes(3)};
  height: ${sizes(3)};
  border-radius: 100%;
  cursor: pointer;
`

export const VolumeSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  border-radius: 2px;
  margin: 0;
  padding: 0;
  width: ${sizes(16)};
  height: ${sizes(1)};
  background: linear-gradient(
    to right,
    ${colors.white} 0%,
    ${colors.white} ${({ value }) => (value ? Number(value) : 0)}%,
    ${colors.transparentWhite[32]} 30%,
    ${colors.transparentWhite[32]} 100%
  );
  outline: none;
  opacity: 0;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform ${transitions.timings.player} ${transitions.easing},
    opacity ${transitions.timings.player} ${transitions.easing};

  ::-moz-range-track {
    border-radius: 4px;
  }

  ::-moz-range-thumb {
    ${thumbStyles};
  }

  ::-webkit-slider-thumb {
    ${thumbStyles};
  }
`

export const VolumeControl = styled.div`
  display: flex;
  border-radius: 20px;
  width: ${sizes(10)};
  transition: background-color ${transitions.timings.sharp} ${transitions.easing},
    width ${transitions.timings.sharp} ${transitions.easing};

  :hover {
    background-color: ${colors.transparentPrimary[18]};
    backdrop-filter: blur(${sizes(8)});
    width: ${sizes(30)};
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

export const CurrentTime = styled(Text)`
  display: flex;
  height: ${sizes(10)};
  margin-left: ${sizes(4)};
  align-items: center;
`

export const ScreenControls = styled.div`
  margin-left: auto;
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
  position: relative;
  height: 100%;

  *:focus {
    outline: none;
  }

  .vjs-playing:hover ${CustomControls} {
    transform: translateY(-${sizes(2)});
    opacity: 1;
  }
  .vjs-paused ${CustomControls} {
    transform: translateY(-${sizes(2)});
    opacity: 1;
  }

  .vjs-user-inactive.vjs-playing > ${CustomControls} {
    transform: translateY(-${sizes(2)});
    opacity: 0;
  }

  .vjs-poster {
    background-size: cover;
  }

  .vjs-control-bar {
    opacity: 0;
    font-family: ${typography.fonts.base};
    background: linear-gradient(180deg, rgba(11, 12, 15, 0) 0%, #0b0c0f 100%);
    align-items: flex-end;
    padding-bottom: ${sizes(8)};
    height: ${sizes(32)} !important;
    transition: opacity ${transitions.timings.player} ${transitions.easing};

    .vjs-duration,
    .vjs-remaining-time,
    .vjs-time-divider,
    .vjs-current-time,
    .vjs-time-control,
    .vjs-volume-panel,
    .vjs-picture-in-picture-control,
    .vjs-fullscreen-control,
    .vjs-play-control {
      display: none;
    }

    .vjs-slider {
      background-color: ${colors.transparentWhite[32]};

      ${focusStyles}

      .vjs-slider-bar {
        background-color: ${colors.blue[500]};
      }
    }

    .vjs-progress-control {
      position: absolute;
      top: initial;
      height: ${sizes(1)};
      left: 0;
      bottom: 0;
      width: 100%;
      transition: height ${transitions.timings.player} ${transitions.easing} !important;

      :hover {
        height: ${sizes(2)};
      }

      .vjs-progress-holder {
        height: 100%;
        margin: 0;

        /* ::before is progress timeline thumb */

        .vjs-play-progress::before {
          content: '';
          position: absolute;
          box-shadow: 0 1px 2px ${colors.transparentBlack[32]};
          opacity: 0;
          border-radius: 100%;
          background: ${colors.white};
          right: -${sizes(2)};
          width: ${sizes(4)};
          height: ${sizes(4)};
          top: -${sizes(1)};
          transition: opacity ${transitions.timings.player} ${transitions.easing};
        }

        :hover .vjs-play-progress::before {
          opacity: 1;
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
    }
  }

  :hover .vjs-control-bar {
    opacity: 1;
  }

  .vjs-paused .vjs-control-bar {
    opacity: 1;
  }

  .vjs-big-play-button {
    display: none !important;
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
