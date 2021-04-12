import { Spinner, Button, Text } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'
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
`

export const AccountSecondary = styled(Text)`
  margin-top: ${sizes(1)};
  color: ${colors.gray[200]};
`

export const StyledButton = styled(Button)`
  align-self: center;
`
