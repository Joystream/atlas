import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
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
  className?: string
  onClick?: () => void
  onFollow?: (event?: React.MouseEvent) => void
}

export const ChannelCardBase: React.FC<ChannelCardBaseProps> = ({
  id,
  isLoading,
  title,
  follows,
  avatarUrl,
  isLoadingAvatar,
  isFollowing,
  className,
  onClick,
  onFollow,
}) => {
  const mdMatch = useMediaMatch('md')
  const [activeDisabled, setActiveDisabled] = useState(false)

  const handleFollowButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onFollow?.(e)
  }
  return (
    <ChannelCardArticle className={className} activeDisabled={activeDisabled}>
      <ChannelCardAnchor onClick={onClick} to={id ? absoluteRoutes.viewer.channel(id) : ''}>
        <StyledAvatar size="channel-card" loading={isLoadingAvatar} assetUrl={avatarUrl} />
        <SwitchTransition>
          <CSSTransition
            key={isLoading ? 'placeholder' : 'content'}
            timeout={parseInt(cVar('animationTransitionFast', true))}
            classNames={transitions.names.fade}
          >
            <InfoWrapper>
              {isLoading ? (
                <>
                  <SkeletonLoader width={100} height={mdMatch ? 24 : 20} bottomSpace={mdMatch ? 4 : 8} />
                  <SkeletonLoader width={70} height={mdMatch ? 20 : 16} bottomSpace={onFollow && 16} />
                  {onFollow && <SkeletonLoader width={60} height={32} />}
                </>
              ) : (
                <>
                  <ChannelTitle variant={mdMatch ? 'h300' : 't200-strong'}>{title}</ChannelTitle>
                  <ChannelFollows variant={mdMatch ? 't200' : 't100'} secondary>
                    {formatNumberShort(follows || 0)} followers
                  </ChannelFollows>
                  {onFollow && (
                    <FollowButton
                      variant="secondary"
                      size="small"
                      onClick={handleFollowButtonClick}
                      onMouseOut={() => setActiveDisabled(false)}
                      onMouseMove={() => setActiveDisabled(true)}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </FollowButton>
                  )}
                </>
              )}
            </InfoWrapper>
          </CSSTransition>
        </SwitchTransition>
      </ChannelCardAnchor>
    </ChannelCardArticle>
  )
}
