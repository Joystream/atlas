import styled from '@emotion/styled'
import { colors, sizes, breakpoints, typography } from '@/shared/theme'
import { Text, Button } from '@/shared/components'

type StyledExitButtonProps = {
  marginLeft?: boolean
}

export const StyledTitleText = styled(Text)`
  margin-bottom: ${sizes(3)};
  line-height: ${sizes(8)};
`

export const StyledContentText = styled(Text)`
  color: ${colors.white};
  font-weight: ${typography.weights.thin};
  margin-bottom: ${sizes(6)};
  word-wrap: break-word;
  line-height: ${sizes(5)};
`

export const StyledHeadRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
`

export const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  @media screen and (min-width: ${breakpoints.small}) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

export const StyledPrimaryButton = styled(Button)`
  margin-bottom: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-left: ${sizes(2)};
    margin-bottom: 0;
  }
`

export const StyledSecondaryButton = styled(Button)`
  background-color: ${colors.transparent};
  color: ${colors.white};
  border: 1px solid ${colors.gray[500]};
  &:hover {
    background-color: ${colors.gray[500]};
    border: 1px solid ${colors.gray[500]};
    color: ${colors.white};
  }
  &:active {
    background-color: ${colors.transparent};
    border: 1px solid ${colors.gray[500]};
  }
`

export const StyledExitButton = styled(Button)<StyledExitButtonProps>`
  padding: 0;
  background-color: ${colors.transparent};
  border: none;
  margin-left: ${({ marginLeft }) => marginLeft && 'auto'};
  &:hover {
    background-color: ${colors.transparent};
  }
`
