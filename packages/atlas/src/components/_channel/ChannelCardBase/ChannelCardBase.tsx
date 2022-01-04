import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'

import {
  ChannelCardAnchor,
  ChannelCardArticle,
  ChannelFollows,
  ChannelTitle,
  FollowButton,
  InfoWrapper,
  StyledAvatar,
} from './ChannelCardBase.styles'

export type ChannelCardBaseProps = {
  id?: string | null
  isLoading?: boolean
  title?: string | null
  follows?: number | null
  avatarUrl?: string | null
  isLoadingAvatar?: boolean
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
  isLoadingAvatar,
  isFollowing,
  onFollow,
  className,
  onClick,
}) => {
  return (
    <ChannelCardArticle className={className}>
      <ChannelCardAnchor onClick={onClick} to={id ? absoluteRoutes.viewer.channel(id) : ''}>
        <StyledAvatar size="channel-card" loading={isLoadingAvatar} assetUrl={avatarUrl} />
        <SwitchTransition>
          <CSSTransition
            key={isLoading ? 'placeholder' : 'content'}
            timeout={parseInt(transitions.timings.sharp)}
            classNames={transitions.names.fade}
          >
            <InfoWrapper>
              {isLoading ? (
                <>
                  <SkeletonLoader width="100px" height="20px" bottomSpace="4px" />
                  <SkeletonLoader width="70px" height="20px" bottomSpace="16px" />
                  <SkeletonLoader width="60px" height="30px" />
                </>
              ) : (
                <>
                  <ChannelTitle variant="h300">{title}</ChannelTitle>
                  <ChannelFollows variant="t200" secondary>
                    {formatNumberShort(follows || 0)} followers
                  </ChannelFollows>
                  <FollowButton variant="secondary" size="small" onClick={onFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </FollowButton>
                </>
              )}
            </InfoWrapper>
          </CSSTransition>
        </SwitchTransition>
      </ChannelCardAnchor>
    </ChannelCardArticle>
  )
}
