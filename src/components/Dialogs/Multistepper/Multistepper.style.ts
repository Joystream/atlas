import styled from '@emotion/styled'
import Dialog from '../GeneralDialog/GeneralDialog'
import { Text, Button } from '@/shared/components'
import { colors, sizes, breakpoints, typography } from '@/shared/theme'

type CircleProps = {
  isFilled?: boolean
}

type StyledStepInfoProps = {
  isActive?: boolean
}

export const StyledDialog = styled(Dialog)`
  max-width: 700px;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  border-bottom: 1px solid ${colors.gray[500]};
  margin: 0 calc(-1 * var(--dialog-padding));
  padding: 0 var(--dialog-padding);
  padding-bottom: var(--dialog-padding);
  hr {
    display: none;
    @media screen and (min-width: ${breakpoints.small}) {
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
  @media screen and (min-width: ${breakpoints.small}) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: ${sizes(4)};
  }
`
export const StyledStepInfo = styled.div<StyledStepInfoProps>`
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  align-items: center;
  margin-right: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
  }
`
export const StyledCircle = styled.div<CircleProps>`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  border: 1px solid ${colors.gray[400]};
  background-color: ${({ isFilled }) => (isFilled ? colors.gray[400] : 'transparent')};
  color: ${({ isFilled }) => (isFilled ? colors.white : colors.gray[300])};
`
export const StyledStepInfoText = styled(Text)<StyledStepInfoProps>`
  display: inline-block;
  color: ${({ isActive }) => (isActive ? colors.white : colors.gray[300])};
  font-size: ${sizes(4)};
  font-weight: ${typography.weights.semibold};
  line-height: 16px;
  margin-left: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    max-width: 120px;
    font-size: ${sizes(3)};
  }
`
