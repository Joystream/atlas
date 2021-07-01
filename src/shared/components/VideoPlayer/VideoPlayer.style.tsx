import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, sizes, transitions, typography, zIndex } from '../../theme'

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

  .vjs-poster {
    background-size: cover;
  }

  .vjs-control-bar {
    font-family: ${typography.fonts.base};
    background: none;
    background-image: linear-gradient(180deg, rgba(11, 12, 15, 0) 0%, #0b0c0f 100%);
    align-items: flex-end;
    padding-bottom: ${sizes(8)};
    height: ${sizes(32)} !important;

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

      ${media.small} {
        display: block;
        margin-left: auto;
      }
    }

    .vjs-fullscreen-control {
      margin-left: auto;
      ${media.small} {
        margin-left: 0;
      }
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
      height: ${sizes(1)};
      left: 0;
      bottom: 0;
      width: 100%;

      :hover .vjs-progress-control {
        opacity: 0;
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
            top: -6px;
            content: '';
            display: initial;
            width: ${sizes(4)};
            height: ${sizes(4)};
            background: ${colors.white};
            border-radius: 100%;
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
