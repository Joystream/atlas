import { css } from '@emotion/react'

import { sizes } from './sizes'

export const transitions = {
  easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  routingEasing: 'cubic-bezier(0.87, 0, 0.13, 1)',
  timings: {
    loading: '600ms',
    regular: '400ms',
    routingSearchOverlay: '400ms',
    routing: '300ms',
    player: '150ms',
    sharp: '125ms',
  },
  names: {
    fade: 'fade',
    fadeAndSlide: 'fade-slide',
    slide: 'slide',
    slideDown: 'slide-down',
    modal: 'modal',
  },
}

export const transitionStyles = css`
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
