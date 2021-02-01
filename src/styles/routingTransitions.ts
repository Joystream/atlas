import { css } from '@emotion/core'
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
      transition: ${transitions.timings.loading} ${transitions.easing};
    }
    transition: ${transitions.timings.loading} ${transitions.easing};
  }

  .${transitions.names.fadeAndSlide}-exit {
    opacity: 1;
  }

  .${transitions.names.fadeAndSlide}-exit-active {
    opacity: 0;
    transition: ${transitions.timings.loading} ${transitions.easing};
  }
`
