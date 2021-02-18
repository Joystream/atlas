import { transitions } from '@/shared/theme'
import { css } from '@emotion/react'

export const transitionStyles = css`
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

  .${transitions.names.dialog}-enter {
    opacity: 0;
    transform: scale(0.88);
  }

  .${transitions.names.dialog}-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }

  .${transitions.names.dialog}-exit {
    opacity: 1;
    transform: scale(1);
  }

  .${transitions.names.dialog}-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`
