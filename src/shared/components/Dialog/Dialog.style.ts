import styled from '@emotion/styled'
import { colors, sizes, breakpoints, typography } from '../../theme'
import { Text, Button } from '@/shared/components'

export const StyledContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  width: 90%;
  margin: 0 auto;
  background-color: ${colors.gray[600]};
  padding: ${sizes(4)};
  @media screen and (min-width: ${breakpoints.small}) {
    width: ${sizes(110)};
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    padding: ${sizes(6)};
  }
`
export const StyledTitleText = styled(Text)`
  margin-bottom: ${sizes(3)};
`

export const StyledContentText = styled(Text)`
  color: ${colors.white};
  font-weight: ${typography.weights.thin};
  margin-bottom: ${sizes(6)};
`

export const StyledHeadRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
  &:nth-child(2) {
    margin-left: auto;
  }
`

export const StyledButtonContainer = styled.div`
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
`
