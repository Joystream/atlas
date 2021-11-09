import styled from '@emotion/styled'

import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { Text } from '@/components/Text'
import { RadioButton } from '@/components/forms/RadioButton'
import { SvgAccountCreationIllustration } from '@/components/illustrations'
import { colors, media, sizes, transitions, typography } from '@/theme'

import { StepWrapper } from './SignInSteps.styles'

type AccountWrapperProps = {
  isSelected?: boolean
}

export const StyledStepWrapper = styled(StepWrapper)`
  margin-top: ${sizes(4)};
`

export const StyledSpinner = styled(Spinner)`
  margin: ${sizes(20)} auto;
`

export const IconGroup = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin: 0 ${sizes(2)};
  }
`

export const AccountStepImg = styled(SvgAccountCreationIllustration)`
  height: 210px;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(2)};
`

export const AccountsWrapper = styled.div`
  width: 100%;
  height: 200px;
  overflow-y: auto;
  margin-top: ${sizes(4)};
`

export const AccountWrapper = styled.label<AccountWrapperProps>`
  background-color: ${colors.transparentPrimary[6]};
  cursor: pointer;
  text-align: left;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: ${sizes(4)};
  padding: ${sizes(2)};
  border: 1px solid ${({ isSelected }) => (isSelected ? colors.blue[500] : 'transparent')};
  transition: border ${transitions.timings.sharp} ${transitions.easing},
    background-color ${transitions.timings.sharp} ${transitions.easing};

  :hover {
    border: 1px solid ${({ isSelected }) => (isSelected ? colors.blue[500] : colors.gray[50])};
    background-color: ${colors.transparentPrimary[12]};
  }
`
export const AccountInfo = styled.div`
  display: flex;
  align-items: center;
`
export const IconWrapper = styled.div`
  background-color: ${colors.transparentWhite[6]};
  border-radius: 100%;
  margin-right: ${sizes(3)};
  width: ${sizes(12)};
  height: ${sizes(12)};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const AccountAddress = styled(Text)`
  margin-top: ${sizes(1)};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
  ${media.xs} {
    max-width: 220px;
  }
  ${media.sm} {
    max-width: initial;
  }
`

export const StyledRadioButton = styled(RadioButton)`
  align-self: center;
  margin: 0;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledButton = styled(Button)`
  margin-left: auto;
`

export const OrderedSteps = styled.ol`
  counter-reset: ordered-steps-counter;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  ${media.md} {
    justify-content: space-between;
  }
`
export const OrderedStep = styled(Text)`
  margin: 10px 10px;
  counter-increment: ordered-list-counter;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  max-width: 170px;
  flex-direction: column;

  ::before {
    margin-bottom: ${sizes(2)};
    content: '0' counter(ordered-list-counter);
    width: 36px;
    height: 36px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.gray[50]};
    padding-bottom: 2px;
    font-family: ${typography.fonts.headers};
    font-size: ${typography.sizes.h6};
    background-color: ${colors.gray[600]};
  }
`
