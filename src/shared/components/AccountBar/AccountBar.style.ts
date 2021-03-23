import { sizes, colors } from '@/shared/theme'
import styled from '@emotion/styled'
import { Button, Text, Avatar } from '@/shared/components'

type AccountWrapperProps = {
  blank?: boolean
}

export const AccountWrapper = styled.div<AccountWrapperProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: ${sizes(8)};
  ${({ blank }) => blank && `cursor: pointer`};
`
export const AccountInfo = styled.div`
  display: flex;
  align-items: center;
`
export const AccountAvatar = styled(Avatar)`
  width: ${sizes(12)};
  height: ${sizes(12)};
  margin-right: ${sizes(3)};
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
  border: 1px solid ${colors.gray[400]};
  padding: ${sizes(2)} ${sizes(3)};
  align-self: center;
`
