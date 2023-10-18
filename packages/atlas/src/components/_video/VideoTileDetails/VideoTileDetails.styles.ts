import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const KebabMenuButtonIcon = styled(Button)<{ smallGap: boolean }>`
  opacity: 0;
  margin-left: ${({ smallGap }) => (smallGap ? sizes(3) : sizes(4))};
  transition: opacity ${cVar('animationTransitionFast')};
  @media (any-pointer: coarse) {
    opacity: 1;
  }
`

export const VideoDetailsContainer = styled.div`
  display: flex;

  :hover {
    ${KebabMenuButtonIcon} {
      opacity: 1;
    }
  }
`

export const VideoTitle = styled(Text)`
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-word;
  cursor: pointer;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

export const StyledAvatar = styled(Avatar)<{ smallGap: boolean }>`
  margin-right: ${({ smallGap }) => (smallGap ? sizes(3) : sizes(4))};
  cursor: pointer;
`

export const VideoInfoContainer = styled.div`
  flex: 1;
  overflow: hidden;
`

export const VideoMetaContainer = styled.div`
  margin-top: ${sizes(2)};
  width: 100%;
`

export const Views = styled(NumberFormat)`
  white-space: nowrap;
`

export const PlaylistButton = styled(TextButton)`
  :not(:only-child) {
    margin-top: ${sizes(1)};
  }
`
