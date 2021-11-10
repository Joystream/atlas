import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_inputs/Button'
import { colors, sizes, transitions } from '@/theme'

export const ChannelCardArticle = styled.article`
  position: relative;
  display: flex;

  :hover:not(:active) {
    ${() => ChannelCardAnchor} {
      transform: translate(-${sizes(2)}, -${sizes(2)});
      box-shadow: ${sizes(2)} ${sizes(2)} 0 ${colors.blue['500']};
    }
  }
`

export const ChannelCardAnchor = styled(Link)`
  width: 100%;
  text-decoration: none;
  align-items: center;
  transition: transform, box-shadow;
  transition-duration: ${transitions.timings.regular};
  transition-timing-function: ${transitions.easing};
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${colors.gray[900]};
  padding: ${sizes(4)} 0;
`

export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(4)};
`

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: ${sizes(4)};
`
