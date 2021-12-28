import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { IconButton } from '@/components/_buttons/IconButton'
import { cVar, sizes } from '@/styles'

export const KebabMenuButtonIcon = styled(IconButton)`
  opacity: 0;
  margin-left: ${sizes(2)};
  transition: opacity ${cVar('animationTransitionFast')};
  @media (any-pointer: coarse) {
    opacity: 1;
  }
`

export const VideoDetailsContainer = styled.div`
  display: flex;
  max-width: 320px;

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
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(4)};
`

export const VideoInfoContainer = styled.div`
  flex: 1;
  overflow: hidden;
`

export const VideoMetaContainer = styled.div`
  margin-top: ${sizes(2)};
  width: 100%;
  display: flex;
  flex-direction: column;
`
