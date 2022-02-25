import styled from '@emotion/styled'

import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { media, sizes } from '@/styles'

import { TopbarBase } from '../TopbarBase'

export const StyledTopbarBase = styled(TopbarBase)`
  ${media.sm} {
    display: flex;
    justify-content: space-between;
  }
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  margin-left: ${sizes(4)};
`

export const StudioTopbarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: ${sizes(3)};
`
