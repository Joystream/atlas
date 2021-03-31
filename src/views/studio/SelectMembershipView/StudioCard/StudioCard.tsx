import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/shared/components/Icon'
import { CardWrapper, HandleText, StyledAvatar, IconWrapper } from './StudioCard.style'

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarPhotoUrl?: string
  empty?: boolean
  onClick?: () => void
  to?: string
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarPhotoUrl, empty, onClick, to }) => {
  return (
    <CardWrapper empty={empty} onClick={onClick} as={to ? Link : 'div'} to={to}>
      {empty ? (
        <IconWrapper>
          <Icon name="profile" />
        </IconWrapper>
      ) : (
        <StyledAvatar imageUrl={avatarPhotoUrl} />
      )}
      <HandleText variant={empty ? 'h5' : 'h4'}>{handle}</HandleText>
    </CardWrapper>
  )
}

export default StudioCard
