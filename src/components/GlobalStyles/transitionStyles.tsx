import { css } from '@emotion/react'

import { transitions } from '@/theme'

export const transitionStyles = css`
  .${transitions.names.fade}-enter {
    opacity: 0 !important;
  }

  .${transitions.names.fade}-enter-active {
    opacity: 1 !important;
  }

  .${transitions.names.fade}-exit {
    opacity: 1 !important;
  }

  .${transitions.names.fade}-exit-active {
    opacity: 0 !important;
  }

  .${transitions.names.fade}-enter-active, .${transitions.names.fade}-exit-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} !important;
  }
`
