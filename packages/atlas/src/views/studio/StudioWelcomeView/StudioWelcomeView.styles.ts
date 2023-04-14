import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionChevronR } from '@/assets/icons'
import { Step } from '@/components/Step'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const InlineText = styled(Text)`
  display: inline-block;
`

export const StepsContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: ${sizes(1)} 0;
  align-items: center;
  margin: ${sizes(6)} 0;
  box-shadow: inset 0 1px 0 0 ${cVar('colorBorderMutedAlpha')}, inset 0 -1px 0 0 ${cVar('colorBorderMutedAlpha')};
  ${media.md} {
    margin: ${sizes(8)} 0;
    overflow: hidden;
    padding: ${sizes(3)};

    ::before,
    ::after {
      position: absolute;
      content: '';
      background: linear-gradient(90deg, #000 0%, rgb(0 0 0 / 0) 100%);
      width: 24px;
      z-index: 1;
      height: 100%;
    }

    ::before {
      left: 0;
    }

    ::after {
      transform: matrix(-1, 0, 0, 1, 0, 0);
      right: 0;
    }
  }
`

export const stepStyles = css`
  overflow: unset;
  width: unset;
`

export const LeftStep = styled(Step)`
  ${stepStyles};

  /* we're setting auto margins instead of "justify-content: center" because of this flex/grid behavior:
   https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container */

  margin-left: auto;
`
export const RightStep = styled(Step)`
  ${stepStyles};

  margin-right: auto;
`

export const StyledSvgActionChevronR = styled(SvgActionChevronR)`
  display: block;
  margin: 0 ${sizes(2)};
  flex-shrink: 0;
  ${media.md} {
    margin: 0 ${sizes(4)};
  }
`
