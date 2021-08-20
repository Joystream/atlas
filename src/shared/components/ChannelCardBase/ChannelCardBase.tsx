import React from 'react'

import { absoluteRoutes } from '@/config/routes'
import { formatNumberShort } from '@/utils/number'

import {
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  InfoWrapper,
  StyledAvatar,
} from './ChannelCardBase.style'

import { SkeletonLoader } from '../SkeletonLoader'

export type ChannelCardBaseProps = {
  id?: string | null
  isLoading?: boolean
  title?: string | null
  follows?: number | null
  avatarUrl?: string | null
  isFollowing?: boolean
  onFollow?: (event: React.MouseEvent) => void
  className?: string
  onClick?: () => void
}

export const ChannelCardBase: React.FC<ChannelCardBaseProps> = ({
  id,
  isLoading,
  title,
  follows,
  avatarUrl,
  isFollowing,
  onFollow,
  className,
  onClick,
}) => {
  return (
    <ChannelCardArticle className={className}>
      <ChannelCardAnchor onClick={onClick} to={absoluteRoutes.viewer.channel(id || '')}>
        <StyledAvatar size="channel-card" loading={isLoading} assetUrl={avatarUrl} />
        <InfoWrapper>
          {isLoading ? (
            <SkeletonLoader width="100px" height="20px" bottomSpace="4px" />
          ) : (
            <ChannelTitle variant="h6">{title}</ChannelTitle>
          )}
          {isLoading ? (
            <SkeletonLoader width="70px" height="20px" bottomSpace="16px" />
          ) : (
            <ChannelFollows variant="body2" secondary>
              {formatNumberShort(follows || 0)} followers
            </ChannelFollows>
          )}
          {isLoading ? (
            <SkeletonLoader width="60px" height="30px" />
          ) : (
            <FollowButton variant="secondary" size="small" onClick={onFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}
        </InfoWrapper>
      </ChannelCardAnchor>
    </ChannelCardArticle>
  )
}
