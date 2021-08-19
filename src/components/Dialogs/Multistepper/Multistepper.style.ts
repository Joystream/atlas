import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

import { BaseDialog } from '../BaseDialog'

export const StyledDialog = styled(BaseDialog)`
  max-width: 740px;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid ${colors.gray[500]};
  margin: 0 calc(-1 * var(--dialog-padding));

  /* account for close button */
  padding: 0 calc(var(--dialog-padding) + 40px) var(--dialog-padding) var(--dialog-padding);

  hr {
    display: none;

    ${media.small} {
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
  display: flex;

  ${media.small} {
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
  }
`

// export const StyledStepInfo = styled.div<StyledStepInfoProps>`
//   display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
//   align-items: center;

//   ${media.small} {
//     display: flex;
//   }
// `
