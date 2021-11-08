import styled from '@emotion/styled'

import { Step } from '@/components/Step'
import { SvgGlyphChevronRight } from '@/components/icons'
import { colors, media, sizes } from '@/theme'

import { Modal } from '../overlays/Modal'

export const StyledModal = styled(Modal)`
  width: 740px;
  background-color: ${colors.gray[700]};
  display: flex;
  flex-direction: column;
  --local-size-stepper-padding: ${sizes(6)};

  padding: var(--local-size-stepper-padding);
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid ${colors.gray[500]};
  margin: 0 calc(-1 * var(--local-size-stepper-padding));
  padding: 0 var(--local-size-stepper-padding) var(--local-size-stepper-padding);

  hr {
    display: none;

    ${media.sm} {
      display: inline;
      width: 16px;
      height: 1px;
      border: none;
      background-color: ${colors.gray[400]};
      margin: 0 ${sizes(4)};
      flex-shrink: 1;
    }
  }
`

export const StyledStepsInfoContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  width: 100%;

  ${media.sm} {
    width: 100%;
    grid-template-columns: repeat(6, auto);
    align-items: center;
  }
`

export const StyledStop = styled(Step)`
  /* workaround for the Step component assuming 56px height, while the design specifies 48px */
  height: 48px;
`

export const StyledChevron = styled(SvgGlyphChevronRight)`
  margin: 0 ${sizes(1)};
  flex-shrink: 0;
  display: none;
  ${media.sm} {
    display: block;
  }

  > path {
    stroke: ${colors.gray[500]};
  }
`
