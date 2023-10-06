import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { square } from '@/styles'

export const RightAlignText = styled(Text)`
  text-align: right;
  margin-left: auto;
`

export const TierWrapper = styled(FlexBox)`
  svg {
    ${square(32)};
  }
`
