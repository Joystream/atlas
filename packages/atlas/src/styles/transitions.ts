import { css } from '@emotion/react'

import { cVar } from './generated/variables'
import { media } from './media'
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
  .${transitions.names.fadeAndSlide}-enter, .${transitions.names.fadeAndSlide}-appear {
    opacity: 0;

    & .${transitions.names.slide} {
      transform: translateY(${sizes(8)});
    }
  }

  .${transitions.names.fadeAndSlide}-enter-active, .${transitions.names.fadeAndSlide}-appear-active {
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

  .${transitions.names.slideDown}-enter, .${transitions.names.slideDown}-appear {
    transform: translateY(-100%);
  }

  .${transitions.names.slideDown}-enter-active, .${transitions.names.slideDown}-appear-active {
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

  .${transitions.names.fade}-enter, .${transitions.names.fade}-appear {
    opacity: 0 !important;
  }

  .${transitions.names.fade}-enter-active, .${transitions.names.fade}-appear-active {
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

  .${transitions.names.modal}-enter, .${transitions.names.modal}-appear {
    transform: translateY(100%);
  }

  .${transitions.names.modal}-enter-active, .${transitions.names.modal}-appear-active {
    transform: translateY(0);
    transition: all ${cVar('animationTransitionMedium')};
  }

  .${transitions.names.modal}-exit {
    transform: translateY(0);
  }

  .${transitions.names.modal}-exit-active {
    transform: translateY(100%);
    transition: all ${cVar('animationTransitionMedium')};
  }

  ${media.sm} {
    .${transitions.names.modal}-enter, .${transitions.names.modal}-appear {
      transform: translate(-50%, -50%) scale(0.8) !important;
      opacity: 0 !important;
    }

    .${transitions.names.modal}-enter-active, .${transitions.names.modal}-appear-active {
      transform: translate(-50%, -50%) scale(1) !important;
      opacity: 1 !important;
    }

    .${transitions.names.modal}-exit {
      transform: translate(-50%, -50%) scale(1) !important;
      opacity: 1 !important;
    }

    .${transitions.names.modal}-exit-active {
      transform: translate(-50%, -50%) scale(0.8) !important;
      opacity: 0 !important;
    }
  }
`
