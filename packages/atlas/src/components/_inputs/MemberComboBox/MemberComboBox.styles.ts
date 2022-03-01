import styled from '@emotion/styled'

import { MemberBadge } from '@/components/MemberBadge'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const MemberBadgesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${sizes(4)};
`

export const StyledSelectedText = styled(Text)`
  color: ${cVar('colorTextMuted')};
  margin-bottom: ${sizes(4)};
  align-self: center;
`

export const StyledMemberBadge = styled(MemberBadge)`
  margin-left: ${sizes(4)};
  margin-bottom: ${sizes(4)};
`
