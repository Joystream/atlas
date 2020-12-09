import React from 'react'
import styled from '@emotion/styled'
import { colors, sizes, typography, zIndex } from '../../theme'
import Icon from '../Icon'
import { css } from '@emotion/core'

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
    transition: opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .vjs-paused:not(.vjs-has-started) .vjs-poster,
  .vjs-ended .vjs-poster {
    opacity: 1;
  }
`

export const Container = styled.div<ContainerProps>`
  video[poster] {
    object-fit: fill;
  }

  position: relative;

  *:focus {
    outline: none;
  }

  .vjs-poster {
    background-size: cover;
  }

  .vjs-control-bar {
    font-family: ${typography.fonts.base};
    background-color: rgba(0, 0, 0, 0.3);
    height: ${sizes(16)} !important;
    align-items: center;

    /* account for progress bar on top */
    padding: 5px ${sizes(8)} 0;

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
      margin-left: auto;
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
      top: 0;
      left: ${sizes(8)};
      width: calc(100% - 2 * ${sizes(8)});
      height: 5px;

      .vjs-progress-holder {
        height: 100%;
        margin: 0;

        .vjs-play-progress ::before {
          display: none;
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
