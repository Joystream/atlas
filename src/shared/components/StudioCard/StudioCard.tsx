import React from 'react'
import { CardWrapper, Follows, HandleText, StyledAvatar } from './StudioCard.style'

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  blank?: boolean
  onClick?: () => void
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, follows, avatarPhotoUrl, blank, onClick }) => {
  return (
    <CardWrapper blank={blank} onClick={onClick}>
      <StyledAvatar imageUrl={avatarPhotoUrl} />
      <HandleText variant={blank ? 'h5' : 'h4'}>{handle}</HandleText>
      {!blank && <Follows variant="body2">{follows} Followers</Follows>}
    </CardWrapper>
  )
}

export default StudioCard
