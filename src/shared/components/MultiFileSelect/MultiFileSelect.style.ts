import { breakpoints, colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const MultiFileSelectContainer = styled.div`
  width: 100%;
`

export const StepsContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(2)};
  grid-template-columns: 1fr;
  justify-content: space-between;
  margin-top: ${sizes(5)};
  @media screen and (min-width: ${breakpoints.small}) {
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
    @media screen and (min-width: ${breakpoints.small}) {
      display: initial;
    }
    transform: rotate(0deg);
  }
`
