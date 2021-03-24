import React from 'react'
import Icon from '../Icon'
import { CardWrapper, Follows, HandleText, StyledAvatar, IconWrapper } from './StudioCard.style'

export type StudioCardProps = {
  variant: 'membership' | 'channel'
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  blank?: boolean
  onClick?: () => void
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, follows, avatarPhotoUrl, blank, onClick, variant }) => {
  return (
    <CardWrapper blank={blank} onClick={onClick}>
      {blank ? (
        <IconWrapper>
          <Icon name="profile" />
        </IconWrapper>
      ) : (
        <StyledAvatar imageUrl={avatarPhotoUrl} />
      )}
      <HandleText variant={blank ? 'h5' : 'h4'}>{handle}</HandleText>
      {!blank && variant === 'channel' && <Follows variant="body2">{follows} Followers</Follows>}
    </CardWrapper>
  )
}

export default StudioCard
