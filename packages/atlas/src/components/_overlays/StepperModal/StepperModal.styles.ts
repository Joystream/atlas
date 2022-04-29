import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Step } from '@/components/Step'
import { SvgActionChevronR } from '@/components/_icons'
import { cVar, media, oldColors, sizes } from '@/styles'

import { DialogModal } from '../DialogModal'

export const StyledModal = styled(DialogModal)``

export const dialogContentCss = css`
  overflow-y: hidden;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: ${cVar('effectDividersBottom')};
  padding: var(--local-size-dialog-padding);

  hr {
    display: none;

    ${media.sm} {
      display: inline;
      width: 16px;
      height: 1px;
      border: none;
      background-color: ${oldColors.gray[400]};
      flex-shrink: 1;
    }
  }
`

export const StyledStepsInfoContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  justify-content: space-between;
  width: 100%;

  button:last-of-type {
    margin-left: ${sizes(6)};
  }

  ${media.sm} {
    width: 100%;
    align-items: center;

    button:last-of-type {
      margin-left: ${sizes(10)};
    }
  }
`

export const StyledStop = styled(Step)`
  /* workaround for the Step component assuming 56px height, while the design specifies 48px */
  height: 48px;
`

export const StyledChevron = styled(SvgActionChevronR)`
  margin: 0 ${sizes(1)};
  flex-shrink: 0;
  display: none;
  ${media.sm} {
    display: block;
  }

  > path {
    stroke: ${oldColors.gray[500]};
  }
`
