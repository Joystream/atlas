import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { breakpoints, cVar, sizes, square } from '@/styles'

export const ChannelCardArticle = styled.article<{ activeDisabled?: boolean }>`
  position: relative;
  display: flex;
  min-width: 160px;

  :hover {
    > a {
      transform: translate(-${sizes(2)}, -${sizes(2)});
      box-shadow: ${sizes(2)} ${sizes(2)} 0 ${cVar('colorCoreBlue500')};
    }
  }

  :active {
    > a {
      ${({ activeDisabled }) =>
        !activeDisabled &&
        css`
          transform: translate(0, 0);
          box-shadow: ${sizes(0)} ${sizes(0)} 0 ${cVar('colorCoreBlue500')};
        `}
    }
  }
`

export const ChannelCardAnchor = styled(Link)`
  width: 100%;
  text-decoration: none;
  align-items: center;
  transition: ${cVar('animationTransitionFast')} box;
  transition-property: transform, box-shadow;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)} 0;
`

export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(4)};
  ${square('104px')}
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
  margin-top: ${sizes(2)};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${breakpoints.md} {
    margin-top: ${sizes(1)};
  }
`

export const FollowButton = styled(Button)`
  margin-top: ${sizes(4)};
`
