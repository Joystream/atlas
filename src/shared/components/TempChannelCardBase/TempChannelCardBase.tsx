import React from 'react'

import { absoluteRoutes } from '@/config/routes'
import { formatNumberShort } from '@/utils/number'

import {
  ButtonSkeletonLoader,
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelCardWrapper,
  ChannelFollows,
  ChannelTitle,
  FollowsSkeletonLoader,
  InfoWrapper,
  RankingNumber,
  StyledAvatar,
  TitleSkeletonLoader,
} from './ChannelCardBase.style'

import { Button } from '../Button'

export type TempChannelCardBaseProps = {
  id?: string | null
  rankingNumber?: number
  isLoading?: boolean
  title?: string | null
  follows?: number | null
  avatarUrl?: string | null
  isFollowing?: boolean
  onFollow?: (event: React.MouseEvent) => void
}

export const TempChannelCardBase: React.FC<TempChannelCardBaseProps> = ({
  id,
  rankingNumber,
  isLoading,
  title,
  follows,
  avatarUrl,
  isFollowing,
  onFollow,
}) => {
  const loading = isLoading || id === undefined

  return (
    <ChannelCardWrapper hasRanking={!!rankingNumber}>
      <ChannelCardArticle>
        {rankingNumber && <RankingNumber>{rankingNumber}</RankingNumber>}
        <ChannelCardAnchor to={absoluteRoutes.viewer.channel(id || '')}>
          <InfoWrapper>
            <StyledAvatar loading={loading} assetUrl={avatarUrl} />
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
          </InfoWrapper>
          {loading ? (
            <ButtonSkeletonLoader width="70px" height="30px" />
          ) : (
            <Button variant="secondary" size="small" onClick={onFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </ChannelCardAnchor>
      </ChannelCardArticle>
    </ChannelCardWrapper>
  )
}
