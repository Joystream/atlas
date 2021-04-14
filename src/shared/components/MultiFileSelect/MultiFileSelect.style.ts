import { colors, sizes, media } from '@/shared/theme'
import styled from '@emotion/styled'

export const MultiFileSelectContainer = styled.div`
  width: 100%;
  max-width: 640px;
`

export const StepsContainer = styled.div`
  width: 100%;
  margin-top: ${sizes(5)};

  ${media.small} {
    margin-top: ${sizes(10)};
    display: flex;
    justify-content: space-between;
  }
`

export const StepDivider = styled.div`
  width: 100%;
  color: ${colors.gray[600]};
  height: ${sizes(10)};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    transform: rotate(90deg);
  }

  ${media.small} {
    width: ${sizes(12)};
    height: initial;
    svg {
      transform: rotate(0deg);
    }
  }
`
