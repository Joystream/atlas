import styled from '@emotion/styled'

import { PolkadotIdenticon } from '@/components/PolkadotIdenticon'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgAccountCreationIllustration } from '@/components/_illustrations'
import { RadioButton } from '@/components/_inputs/RadioButton'
import { Spinner } from '@/components/_loaders/Spinner'
import { cVar, media, oldColors, sizes, transitions } from '@/styles'

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
  &:first-of-type {
    margin-top: ${sizes(2)};
  }
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
  margin-right: ${sizes(4)};
  padding: ${sizes(2)} ${sizes(6)} ${sizes(2)} ${sizes(2)};
  border: 1px solid ${({ isSelected }) => (isSelected ? oldColors.blue[500] : cVar('colorBackgroundElevated'))};
  background-color: ${({ isSelected }) => (isSelected ? cVar('colorCoreNeutral800Lighten') : 'transparent')};
  transition: border ${transitions.timings.sharp} ${transitions.easing},
    background-color ${transitions.timings.sharp} ${transitions.easing};

  :hover {
    border: 1px solid ${({ isSelected }) => (isSelected ? oldColors.blue[500] : oldColors.gray[50])};
    background-color: ${cVar('colorCoreNeutral700Lighten')};
  }
`
export const AccountInfo = styled.div`
  display: flex;
  align-items: center;
`

export const StyledPolkadotIdenticon = styled(PolkadotIdenticon)`
  margin-right: ${sizes(4)};
`

export const AccountAddress = styled(Text)`
  margin-top: ${sizes(1)};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
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
  margin: 10px 10px 20px;
  counter-increment: ordered-list-counter;
  display: flex;
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
    color: ${oldColors.gray[50]};
    padding-bottom: 2px;
    font: ${cVar('typographyDesktopH300')};
    letter-spacing: ${cVar('typographyDesktopH300LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH300TextTransform')};
    background-color: ${oldColors.gray[600]};
  }
`
