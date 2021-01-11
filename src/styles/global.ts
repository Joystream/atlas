import { css } from '@emotion/core'
import { transitions } from '@/shared/theme'

export const globalStyles = css`
  .${transitions.names.fade}-enter {
    opacity: 0;
  }

  .${transitions.names.fade}-enter-active {
    opacity: 1;
  }

  .${transitions.names.fade}-exit {
    opacity: 1;
  }

  .${transitions.names.fade}-exit-active {
    opacity: 0;
  }

  .${transitions.names.fade}-enter-active, .${transitions.names.fade}-exit-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing};
  }
`
