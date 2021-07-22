import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

export const ControlsIndicatorWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: calc(50% - ${sizes(10)});
  left: calc(50% - ${sizes(10)});
  ${media.small} {
    top: calc(50% - ${sizes(16)});
    left: calc(50% - ${sizes(16)});
  }
`

export const ControlsIndicatorIconWrapper = styled.div`
  width: ${sizes(20)};
  height: ${sizes(20)};
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
  .indicator-exit {
    opacity: 1;
  }

  .indicator-exit-active {
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
