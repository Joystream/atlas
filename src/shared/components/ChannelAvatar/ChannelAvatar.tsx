import React from 'react'
import { Container, Name, StyledAvatar } from './ChannelAvatar.style'

type ChannelAvatarProps = {
  handle: string
  avatarUrl?: string | null
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const ChannelAvatar: React.FC<ChannelAvatarProps> = ({ handle, avatarUrl, className, onClick }) => {
  return (
    <Container className={className} onClick={onClick}>
      <StyledAvatar handle={handle} imageUrl={avatarUrl} />
      <Name>{handle}</Name>
    </Container>
  )
}

export default ChannelAvatar
