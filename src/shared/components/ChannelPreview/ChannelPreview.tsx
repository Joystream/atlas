import React from 'react'
import styled from '@emotion/styled'
import ChannelPreviewBase from './ChannelPreviewBase'
import { typography } from '../../theme'
import { Avatar } from '..'
import Text from '../Text'

type ChannelPreviewProps = {
  name: string
  avatarURL?: string | null
  className?: string
  animated?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const ChannelPreview: React.FC<ChannelPreviewProps> = ({ name, avatarURL, className, animated = false, onClick }) => {
  const avatarNode = <StyledAvatar imageUrl={avatarURL} handle={name} />
  const nameNode = <NameHeader variant="h6">{name}</NameHeader>

  return (
    <ChannelPreviewBase
      className={className}
      avatarNode={avatarNode}
      nameNode={nameNode}
      animated={animated}
      onClick={onClick}
    />
  )
}

const NameHeader = styled(Text)`
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

export const StyledAvatar = styled(Avatar)`
  width: 100%;
  height: 100%;
  span {
    font-size: ${typography.sizes.h2};
  }
`

export default ChannelPreview
