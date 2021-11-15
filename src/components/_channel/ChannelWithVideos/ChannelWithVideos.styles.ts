import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { sizes } from '@/theme'

export const ChannelCardAnchor = styled(Link)`
  text-decoration: none;
  align-items: center;
  transition: transform, box-shadow;
  display: inline-flex;
  justify-content: unset;
  margin-bottom: ${sizes(10)};
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(6)};
`

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

export const ChannelTitle = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ChannelFollows = styled(Text)`
  margin-top: ${sizes(1)};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const FollowButton = styled(Button)`
  margin-top: ${sizes(2)};
`
