import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const MultiFileSelectContainer = styled.div`
  width: 640px;
`

export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${sizes(10)};
`

export const StepDivider = styled.div`
  width: ${sizes(12)};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.gray[600]};
`
