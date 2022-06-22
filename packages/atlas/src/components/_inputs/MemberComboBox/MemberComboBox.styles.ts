import styled from '@emotion/styled'

import { OutputPill } from '@/components/OutputPill'
import { sizes } from '@/styles'

export const MemberBadgesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${sizes(4)};
  gap: ${sizes(3)};
`

export const StyledOutputPill = styled(OutputPill)`
  margin-bottom: ${sizes(4)};
`
