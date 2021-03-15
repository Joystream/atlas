import React from 'react'
import { CardWrapper, Follows, HandleText, StyledAvatar } from './ChannelCard.style'

export type ChannelCardProps = {
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  createCard?: boolean
}

const ChannelCard: React.FC<ChannelCardProps> = ({ handle, follows, avatarPhotoUrl, createCard }) => {
  return (
    <CardWrapper createCard={createCard}>
      <StyledAvatar imageUrl={avatarPhotoUrl} />
      <HandleText variant={createCard ? 'h5' : 'h4'}>{createCard ? 'Create a Channel' : handle}</HandleText>
      {!createCard && <Follows variant="body2">{follows} Followers</Follows>}
    </CardWrapper>
  )
}

export default ChannelCard
