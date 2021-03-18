import React from 'react'
import { CardWrapper, Follows, HandleText, StyledAvatar } from './ChannelCard.style'

export type ChannelCardProps = {
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  blank?: boolean
}

const ChannelCard: React.FC<ChannelCardProps> = ({ handle, follows, avatarPhotoUrl, blank }) => {
  return (
    <CardWrapper blank={blank}>
      <StyledAvatar imageUrl={avatarPhotoUrl} />
      <HandleText variant={blank ? 'h5' : 'h4'}>{blank ? 'Create a Channel' : handle}</HandleText>
      {!blank && <Follows variant="body2">{follows} Followers</Follows>}
    </CardWrapper>
  )
}

export default ChannelCard
