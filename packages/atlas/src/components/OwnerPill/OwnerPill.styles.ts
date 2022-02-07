import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

import { Text } from '../Text'

export const OwnerPillWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${cVar('colorBackgroundOverlay')};
  padding: ${sizes(1)} ${sizes(3)} ${sizes(1)} ${sizes(1)};
  border-radius: 999px;
  max-width: 100%;
`

export const DesaturedText = styled(Text)`
  display: block;
  opacity: 0.75;
  margin-left: ${sizes(1.5)};
`
export const MembershipHandle = styled(Text)`
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-left: ${sizes(1)};
`
