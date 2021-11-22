import styled from '@emotion/styled'

import { media, oldColors, sizes, transitions } from '@/styles'

export const MultiFileSelectContainer = styled.div`
  width: 100%;
`

export const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;
  margin-top: ${sizes(10)};
  position: relative;

  ${media.sm} {
    grid-template-columns: 1fr auto 1fr;
    margin-top: ${sizes(10)};
    grid-gap: ${sizes(2)};
  }
`

export const StepDivider = styled.div`
  color: ${oldColors.gray[600]};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(8)};
  height: initial;
  margin: ${sizes(5)} auto;

  svg {
    transform: rotate(90deg);

    ${media.sm} {
      transform: rotate(0deg);
    }
  }
`

export const AnimatedUnderline = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  height: 4px;
  background-color: ${oldColors.blue[500]};
  width: 100%;
  will-change: left;

  &.underline-enter,
  &.underline-exit {
    transition: left ${transitions.timings.regular} ${transitions.easing};
  }

  ${media.sm} {
    display: block;
  }
`
