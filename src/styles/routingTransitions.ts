import { css } from '@emotion/react'
import { transitions, sizes } from '@/shared/theme'

export const routingTransitions = css`
  .${transitions.names.fadeAndSlide}-enter {
    opacity: 0;

    & .${transitions.names.slide} {
      transform: translateY(${sizes(8)});
    }
  }

  .${transitions.names.fadeAndSlide}-enter-active {
    opacity: 1;
    & .${transitions.names.slide} {
      transform: translateY(0);
      transition: ${transitions.timings.routing} ${transitions.routingEasing};
    }
    transition: ${transitions.timings.routing} ${transitions.routingEasing};
  }

  .${transitions.names.fadeAndSlide}-exit {
    opacity: 1;
  }

  .${transitions.names.fadeAndSlide}-exit-active {
    opacity: 0;
    transition: ${transitions.timings.routing} ${transitions.routingEasing};
  }

  .${transitions.names.slideDown}-enter {
    transform: translateY(-100%);
  }

  .${transitions.names.slideDown}-enter-active {
    transition: transform ${transitions.timings.routingSearchOverlay} ${transitions.routingEasing};
    transform: translateY(0%);
  }

  .${transitions.names.slideDown}-exit {
    transform: translateY(0%);
  }

  .${transitions.names.slideDown}-exit-active {
    transition: transform ${transitions.timings.routingSearchOverlay} ${transitions.routingEasing};
    transform: translateY(-100%);
  }

  .${transitions.names.slideUp}-appear {
  }

  .${transitions.names.slideUp}-appear-done {
    display: block !important;
  }

  .${transitions.names.slideUp}-enter {
    transform: translateY(calc(100% - var(--upload-video-action-sheet-bar-height))) !important;
  }

  .${transitions.names.slideUp}-enter-active {
    transition: transform ${transitions.timings.routing} ${transitions.routingEasing};
    transform: translateY(0%) !important;
  }

  .${transitions.names.slideUp}-enter-done {
    transform: translateY(0%) !important;
  }

  .${transitions.names.slideUp}-exit {
    transform: translateY(0%) !important;
  }

  .${transitions.names.slideUp}-exit-active {
    transition: transform ${transitions.timings.routing} ${transitions.routingEasing};
    transform: translateY(calc(100% - var(--upload-video-action-sheet-bar-height))) !important;
  }

  /* .${transitions.names.slideUp}-exit-done {
    transform: translateY(90%);
  } */
`
