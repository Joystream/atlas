import styled from '@emotion/styled'

import { OutputPill } from '@/components/OutputPill'
import { Text } from '@/components/Text'
import { sizes } from '@/styles'

export const MemberBadgesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${sizes(4)};
`

export const StyledSelectedText = styled(Text)`
  align-self: center;
`

export const StyledOutputPill = styled(OutputPill)`
  margin-left: ${sizes(4)};
  margin-bottom: ${sizes(4)};
`
