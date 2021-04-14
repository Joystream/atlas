import { Button, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const StyledButton = styled(Button)`
  margin-top: ${sizes(8)};
`

export const RefreshText = styled(Text)`
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(10)};
  cursor: pointer;
`
