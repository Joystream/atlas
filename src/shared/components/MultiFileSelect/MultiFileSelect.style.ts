import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

export const MultiFileSelectContainer = styled.div`
  width: 100%;
`

export const StepsContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(2)};
  grid-template-columns: 1fr;
  justify-content: space-between;
  margin-top: ${sizes(5)};

  ${media.small} {
    grid-template-columns: 1fr auto 1fr;
    margin-top: ${sizes(10)};
  }
`

export const StepDivider = styled.div`
  color: ${colors.gray[600]};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(8)};
  height: initial;

  svg {
    display: none;
    ${media.small} {
      display: initial;
    }

    transform: rotate(0deg);
  }
`
