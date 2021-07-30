import styled from '@emotion/styled'

import { colors, media, sizes, transitions } from '@/shared/theme'

import { Loader } from '../Loader'

export const ControlsIndicatorWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
`

const INDICATOR_SIZE = sizes(20)

export const ControlsIndicatorIconWrapper = styled.div`
  width: ${INDICATOR_SIZE};
  height: ${INDICATOR_SIZE};
  backdrop-filter: blur(${sizes(6)});
  background-color: ${colors.transparentBlack[54]};
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
  ${media.small} {
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
  background-color: ${colors.transparentBlack[54]};
  padding: ${sizes(2)};
  text-align: center;
  margin-top: ${sizes(3)};
  backdrop-filter: blur(${sizes(8)});

  ${media.small} {
    display: block;
  }
`

const animationEasing = 'cubic-bezier(0, 0, 0.3, 1)'

export const ControlsIndicatorTransitions = styled.div`
  .indicator-enter {
    ${() => StyledLoader} {
      opacity: 0;
      transform: scale(0.5);
    }
  }

  .indicator-enter-active {
    ${() => StyledLoader} {
      opacity: 1;
      transform: scale(1);
      transition: opacity ${transitions.timings.sharp} ease-in, transform ${transitions.timings.sharp} ease-in;
    }
  }

  .indicator-exit {
    opacity: 1;
    ${() => StyledLoader} {
      opacity: 1;
      transform: scale(1);
    }
  }

  .indicator-exit-active {
    ${() => StyledLoader} {
      opacity: 0;
      transform: scale(0.5);
      transition: opacity 0ms ease-in, transform 0ms ease-in;
    }
    ${ControlsIndicatorIconWrapper} {
      transform: scale(1);
      opacity: 0;
      transition: transform 750ms ${animationEasing}, opacity 600ms 150ms ${animationEasing};

      > svg {
        transform: scale(1);
        transition: transform 750ms ${animationEasing};
      }
    }
    ${ControlsIndicatorTooltip} {
      opacity: 0;
      transition: transform 750ms ${animationEasing}, opacity 600ms 150ms ${animationEasing};
    }
  }
`
export const StyledLoader = styled(Loader)`
  /* align position with indicator */
  margin-bottom: calc(${INDICATOR_SIZE} / 2);
`
