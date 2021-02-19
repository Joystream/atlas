import styled from '@emotion/styled'
import { colors, sizes, typography, breakpoints } from '@/shared/theme'
import { Text, Button } from '@/shared/components'

type StyledButtonsProps = {
  isActionBarPrimary?: boolean
}

export const StyledActionBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${colors.gray[800]};
  padding: ${sizes(3)} ${sizes(8)};
  @media screen and (min-width: ${breakpoints.small}) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const StyledInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: ${sizes(4)};
  @media screen and (min-width: ${breakpoints.small}) {
    width: 50%;
    align-items: flex-start;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    flex-direction: row;
    padding-bottom: 0;
  }
`

export const StyledPrimaryText = styled(Text)`
  color: ${colors.white};
  font-family: ${typography.fonts.headers};
  font-size: ${typography.sizes.h5};
  font-weight: ${typography.weights.bold};
  text-align: right;
  letter-spacing: ${sizes(0.5)};
  padding-bottom: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-right: ${sizes(4)};
  }
`

export const StyledSecondaryText = styled(Text)`
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.body2};
  line-height: 20px;
  max-width: 280px;
  text-align: right;
  @media screen and (min-width: ${breakpoints.small}) {
    text-align: left;
  }
`

export const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${breakpoints.small}) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
`

export const StyledPrimaryButton = styled(Button)<StyledButtonsProps>`
  background-color: ${({ isActionBarPrimary }) => !isActionBarPrimary && 'transparent'};
  border-color: ${({ isActionBarPrimary }) => !isActionBarPrimary && colors.gray[400]};
`

export const StyledSecondaryButton = styled(Button)<StyledButtonsProps>`
  border: none;
  background-color: ${colors.transparent};
  margin-right: ${sizes(2)};
  &:hover {
    background-color: ${colors.gray[700]};
  }
  &:active {
    background-color: ${({ isActionBarPrimary }) => !isActionBarPrimary && colors.gray[800]};
  }
`
