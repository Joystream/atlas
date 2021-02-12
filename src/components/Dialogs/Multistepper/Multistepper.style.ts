import styled from '@emotion/styled'
import { Text, Button } from '@/shared/components'
import { colors, sizes, breakpoints, typography } from '@/shared/theme'

type CircleProps = {
  isFilled?: boolean
}

type TextProps = {
  isActive?: boolean
}

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  border-bottom: 1px solid ${colors.gray[500]};
  margin: -${sizes(4)} -${sizes(4)} 0;
  padding: ${sizes(4)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin: -${sizes(6)} -${sizes(6)} 0;
  }
  hr {
    width: 16px;
    height: 1px;
    border: none;
    background-color: ${colors.gray[400]};
    margin: 0 ${sizes(4)};
    flex-shrink: 1;
  }
`

export const StyledStepsInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export const StyledStepInfo = styled.div`
  display: flex;
  align-items: center;
`
export const StyledCircle = styled.div<CircleProps>`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colors.gray[400]};
  background-color: ${({ isFilled }) => (isFilled ? colors.gray[400] : 'transparent')};
  color: ${({ isFilled }) => (isFilled ? colors.white : colors.gray[300])};
`
export const StyledStepInfoText = styled(Text)<TextProps>`
  display: none;
  width: 120px;
  word-wrap: break-word;
  color: ${({ isActive }) => (isActive ? colors.white : colors.gray[300])};
  font-size: 12px;
  font-weight: ${typography.weights.semibold};
  line-height: 16px;
  margin-left: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    display: inline-block;
  }
`

export const StyledExitButton = styled(Button)`
  padding: 0;
  background-color: ${colors.transparent};
  border: none;
  &:hover {
    background-color: ${colors.transparent};
  }
`
