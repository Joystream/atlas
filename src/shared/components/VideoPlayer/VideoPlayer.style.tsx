import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { breakpoints, colors, sizes, transitions, typography, zIndex } from '../../theme'
import Icon from '../Icon'

type ContainerProps = {
  isInBackground?: boolean
}

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

  .vjs-paused:not(.vjs-has-started) .vjs-poster,
  .vjs-ended .vjs-poster {
    opacity: 1;
  }
`

export const Container = styled.div<ContainerProps>`
  position: relative;
  height: 100%;
  *:focus {
    outline: none;
  }

  .vjs-poster {
    background-size: cover;
  }
  .vjs-control-bar {
    font-family: ${typography.fonts.base};
    background: none;
    margin-top: auto;
    z-index: ${zIndex.overlay + 1};
    align-items: center;
    height: ${sizes(16)} !important;

    @media screen and (min-width: ${breakpoints.small}) {
      padding: 5px ${sizes(8)} 0;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .vjs-control {
      height: 30px;

      .vjs-icon-placeholder ::before {
        line-height: 1.25;
        font-size: ${typography.sizes.icon.xlarge};
      }
    }

    .vjs-time-control {
      display: inline-block;
      font-size: ${typography.sizes.caption};
      user-select: none;
      height: unset;
    }
    .vjs-play-control {
      order: -5;
    }
    .vjs-current-time {
      order: -4;
      padding-right: 0;
    }
    .vjs-time-divider {
      order: -3;
      padding: 0 4px;
      min-width: 0;
    }
    .vjs-duration {
      order: -2;
      padding-left: 0;
    }
    .vjs-volume-panel {
      order: -1;
    }
    .vjs-remaining-time {
      display: none;
    }

    .vjs-picture-in-picture-control {
      display: none;
      @media screen and (min-width: ${breakpoints.small}) {
        display: block;
        margin-left: auto;
      }
    }
    .vjs-fullscreen-control {
      @media screen and (max-width: ${breakpoints.small}) {
        margin-left: auto;
      }
    }

    .vjs-slider {
      background-color: ${colors.gray[400]};

      .vjs-slider-bar,
      .vjs-volume-level {
        background-color: ${colors.blue[500]};
      }
    }

    .vjs-progress-control {
      position: absolute;
      transition: none !important;
      top: initial;
      height: 2px;
      left: 0;
      width: 100%;
      bottom: -2px;

      @media screen and (min-width: ${breakpoints.small}) {
        top: 0;
        left: ${sizes(8)};
        width: calc(100% - 2 * ${sizes(8)});
        height: 5px;
      }

      .vjs-progress-holder {
        height: 100%;
        margin: 0;

        .vjs-play-progress {
          .vjs-time-tooltip {
            display: none;
          }
          ::before {
            position: absolute;
            top: -5px;
            content: '';
            display: initial;
            width: 14px;
            height: 14px;
            background: ${colors.blue[500]};
            border-radius: 100%;
            border: 2px solid ${colors.white};
            @media screen and (min-width: ${breakpoints.small}) {
              display: none;
            }
          }
        }

        .vjs-load-progress {
          background-color: ${colors.gray[200]};

          div {
            background: none;
          }
        }
      }
    }

    .vjs-volume-control {
      width: 72px !important;
      .vjs-volume-bar {
        width: 72px;
        margin-left: 0;
        margin-right: 0;
        height: 4px;
        .vjs-volume-level {
          height: 4px;
          ::before {
            font-size: ${typography.sizes.icon.small};
            top: -0.25em;
          }
        }
      }
    }
  }

  .vjs-big-play-button {
    display: none !important;
  }
  /* 
  Targeting firefox, picture-in-picture in firefox is not placed in the bar,
  thus we need margin-left to move button to the right side
   */
  @-moz-document url-prefix() {
    .vjs-fullscreen-control {
      margin-left: auto;
    }
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

const StyledIcon = styled(Icon)`
  height: 72px;
  width: 72px;
  color: ${colors.white};
`
export const StyledPlayIcon = ({ ...svgProps }) => <StyledIcon name="play-outline" {...svgProps} />
