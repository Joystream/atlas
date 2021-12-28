import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { IconButton } from '@/components/_buttons/IconButton'
import { sizes } from '@/styles'

export const VideoDetailsContainer = styled.div`
  display: flex;
  max-width: 320px;
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(4)};
`

export const VideoInfoContainer = styled.div``

export const VideoMetaContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
`
export const KebabMenuButtonIcon = styled(IconButton)`
  opacity: 1;
  margin-left: ${sizes(2)};
`
