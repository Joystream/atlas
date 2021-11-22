import styled from '@emotion/styled'

import { Loader } from '@/components/_loaders/Loader'
import { media, oldColors, sizes } from '@/styles'

const INDICATOR_SIZE = sizes(20)
export const INDICATOR_TIMEOUT = 750
export const INDICATOR_TRANSITION = 'indicator'

export const ControlsIndicatorWrapper = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (hover: hover) {
    display: flex;
  }
`

export const LoaderWrapper = styled(ControlsIndicatorWrapper)`
  display: flex;
`

export const StyledLoader = styled(Loader)`
  width: ${sizes(9)};
  @media (hover: hover) {
    /* align position with indicator */
    margin-bottom: calc(${INDICATOR_SIZE} / 2);
    width: ${sizes(18)};
  }
`

export const ControlsIndicatorIconWrapper = styled.div`
  width: ${INDICATOR_SIZE};
  height: ${INDICATOR_SIZE};
  backdrop-filter: blur(${sizes(6)});
  background-color: ${oldColors.transparentBlack[54]};
  border-radius: 100%;
  display: flex;
  transform: scale(0.5);
  justify-content: center;
  align-items: center;

  > svg {
    transform: scale(0.75);
    width: ${sizes(12)};
    height: ${sizes(12)};
  }
  ${media.sm} {
    width: ${sizes(32)};
    height: ${sizes(32)};

    > svg {
      transform: scale(0.75);
      width: ${sizes(18)};
      height: ${sizes(18)};
    }
  }
`

export const ControlsIndicatorTooltip = styled.div`
  user-select: none;
  display: none;
  align-self: center;
  background-color: ${oldColors.transparentBlack[54]};
  padding: ${sizes(2)};
  text-align: center;
  margin-top: ${sizes(3)};
  backdrop-filter: blur(${sizes(8)});

  ${media.sm} {
    display: flex;
  }
`

const animationEasing = 'cubic-bezier(0, 0, 0.3, 1)'

export const ControlsIndicatorTransitions = styled.div`
  .${INDICATOR_TRANSITION}-enter {
    ${() => StyledLoader} {
      opacity: 0;
      transform: scale(0.5);
    }
  }

  .${INDICATOR_TRANSITION}-enter-active {
    ${() => StyledLoader} {
      opacity: 1;
      transform: scale(1);
      transition: opacity, transform;
      transition-timing-function: ${animationEasing};
      transition-duration: 200ms;
      @media (hover: hover) {
        transition-delay: ${INDICATOR_TIMEOUT - 200}ms;
      }
    }
  }

  .${INDICATOR_TRANSITION}-exit {
    opacity: 1;
    ${() => StyledLoader} {
      opacity: 1;
      transform: scale(1);
    }
  }

  .${INDICATOR_TRANSITION}-exit-active {
    ${() => StyledLoader} {
      opacity: 0;
      transform: scale(0.5);
      transition: opacity, transform;
      transition-timing-function: ${animationEasing};
    }
    ${ControlsIndicatorIconWrapper} {
      transform: scale(1);
      opacity: 0;
      transition: transform ${INDICATOR_TIMEOUT}ms ${animationEasing},
        opacity ${INDICATOR_TIMEOUT - 150}ms ${animationEasing} 150ms;

      > svg {
        transform: scale(1);
        transition: transform ${INDICATOR_TIMEOUT}ms ${animationEasing};
      }
    }
    ${ControlsIndicatorTooltip} {
      opacity: 0;
      transition: transform ${INDICATOR_TIMEOUT}ms ${animationEasing},
        opacity ${INDICATOR_TIMEOUT - 150}ms ${animationEasing} 150ms;
    }
  }
`
