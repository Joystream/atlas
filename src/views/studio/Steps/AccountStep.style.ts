import { Button, Text } from '@/shared/components'
import Spinner from '@/shared/components/Spinner/Spinner'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const AccountCreationImg = styled.img``

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
export const AccountAvatar = styled.img`
  width: ${sizes(12)};
  height: ${sizes(12)};
  border-radius: 100%;
  margin-right: ${sizes(3)};
`

export const AccountBalance = styled(Text)`
  margin-top: ${sizes(1)};
  color: ${colors.gray[200]};
`

export const StyledButton = styled(Button)`
  border: 1px solid ${colors.gray[400]};
  padding: ${sizes(2)} ${sizes(3)};
  align-self: center;
`

export const StyledSpinner = styled(Spinner)`
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(10)};
  font-size: 40px;
`
