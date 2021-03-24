import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icon'
import { CardWrapper, Follows, HandleText, StyledAvatar, IconWrapper } from './StudioCard.style'

export type StudioCardProps = {
  variant: 'membership' | 'channel'
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  blank?: boolean
  onClick?: () => void
  to?: string
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, follows, avatarPhotoUrl, blank, onClick, variant, to }) => {
  return (
    <CardWrapper blank={blank} onClick={onClick} as={to ? Link : 'div'} to={to}>
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
