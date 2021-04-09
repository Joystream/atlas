import { Spinner, Button, Text } from '@/shared/components'
import { sizes, colors, typography } from '@/shared/theme'
import styled from '@emotion/styled'

export const AccountStepImg = styled.img`
  object-fit: cover;
  max-width: 100%;
`

export const StyledSpinner = styled(Spinner)`
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(5)};
`
export const AccountsWrapper = styled.div`
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 30px;
`

export const AccountWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: ${sizes(8)};
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
  svg {
    width: ${sizes(4)};
    height: ${sizes(4)};
    color: ${colors.transparentWhite[32]};
  }
`

export const AccountSecondary = styled(Text)`
  margin-top: ${sizes(1)};
  color: ${colors.gray[200]};
`

export const StyledButton = styled(Button)`
  align-self: center;
`

export const OrderedSteps = styled.ol`
  counter-reset: ordered-steps-counter;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
`
export const OrderedStep = styled(Text)`
  margin: 10px 30px;
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
    font-family: ${typography.fonts.headers};
    font-size: ${typography.sizes.h6};
    background-color: ${colors.gray[600]};
  }
`
