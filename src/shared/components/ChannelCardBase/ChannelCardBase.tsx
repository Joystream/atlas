import React from 'react'

import { ChannelVariant } from '@/components/ChannelCard'
import { absoluteRoutes } from '@/config/routes'
import { formatNumberShort } from '@/utils/number'

import {
  ButtonSkeletonLoader,
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelCardWrapper,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  FollowsSkeletonLoader,
  InfoWrapper,
  RankingNumber,
  StyledAvatar,
  TitleSkeletonLoader,
} from './ChannelCardBase.style'

export type ChannelCardBaseProps = {
  id?: string | null
  rankingNumber?: number
  isLoading?: boolean
  title?: string | null
  follows?: number | null
  avatarUrl?: string | null
  isFollowing?: boolean
  onFollow?: (event: React.MouseEvent) => void
  variant?: ChannelVariant
  className?: string
  onClick?: () => void
}

export const ChannelCardBase: React.FC<ChannelCardBaseProps> = ({
  id,
  rankingNumber,
  isLoading,
  title,
  follows,
  avatarUrl,
  isFollowing,
  onFollow,
  variant = 'primary',
  className,
  onClick,
}) => {
  const loading = isLoading || id === undefined

  return (
    <ChannelCardWrapper className={className} hasRanking={!!rankingNumber}>
      <ChannelCardArticle variant={variant}>
        {rankingNumber && <RankingNumber>{rankingNumber}</RankingNumber>}
        <ChannelCardAnchor onClick={onClick} variant={variant} to={absoluteRoutes.viewer.channel(id || '')}>
          <StyledAvatar
            variant={variant}
            size={variant === 'primary' ? 'channel-card' : 'channel'}
            loading={loading}
            assetUrl={avatarUrl}
          />
          <InfoWrapper variant={variant}>
            {loading ? (
              <TitleSkeletonLoader width="140px" height="20px" />
            ) : (
              <ChannelTitle variant="h6">{title}</ChannelTitle>
            )}
            {loading ? (
              <FollowsSkeletonLoader width="60px" height="20px" />
            ) : (
              <ChannelFollows variant="body2" secondary>
                {formatNumberShort(follows || 0)} followers
              </ChannelFollows>
            )}
            {loading ? (
              <ButtonSkeletonLoader width="70px" height="30px" />
            ) : (
              <FollowButton variant="secondary" size={variant === 'primary' ? 'small' : 'medium'} onClick={onFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </FollowButton>
            )}
          </InfoWrapper>
        </ChannelCardAnchor>
      </ChannelCardArticle>
    </ChannelCardWrapper>
  )
}
