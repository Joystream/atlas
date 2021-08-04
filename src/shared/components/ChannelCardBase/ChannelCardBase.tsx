import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useHandleFollowChannel } from '@/hooks'
import { transitions } from '@/shared/theme'

import {
  Anchor,
  AvatarContainer,
  FollowButton,
  Info,
  InnerContainer,
  OuterContainer,
  StyledAvatar,
  TextBase,
  VideoCount,
  VideoCountContainer,
} from './ChannelCardBase.style'

import { SkeletonLoader } from '../SkeletonLoader'

export type ChannelCardBaseProps = {
  assetUrl?: string | null
  title?: string | null
  videoCount?: number
  channelHref?: string
  className?: string
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  variant?: 'primary' | 'secondary'
  follows?: number | null
  channelId?: string
}

export const ChannelCardBase: React.FC<ChannelCardBaseProps> = ({
  assetUrl,
  title,
  videoCount,
  loading = true,
  channelHref,
  className,
  onClick,
  variant,
  follows,
  channelId,
}) => {
  const { followChannel, isFollowing } = useHandleFollowChannel(channelId)
  const isAnimated = !loading && !!channelHref && variant === 'primary'
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick) return
    onClick(e)
  }
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!channelHref) {
      e.preventDefault()
    }
  }

  const handleFollow = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    followChannel()
  }

  const followersLabel = follows && follows >= 1 ? `${follows} Follower` : `${follows} Followers`

  return (
    <OuterContainer className={className} onClick={handleClick} variant={variant}>
      <Anchor to={channelHref ?? ''} onClick={handleAnchorClick}>
        <SwitchTransition>
          <CSSTransition
            key={loading ? 'placeholder' : 'content'}
            timeout={parseInt(transitions.timings.loading) * 0.75}
            classNames={transitions.names.fade}
          >
            <InnerContainer animated={isAnimated}>
              <AvatarContainer>
                {loading ? <SkeletonLoader rounded /> : <StyledAvatar assetUrl={assetUrl} />}
              </AvatarContainer>
              <Info>
                {loading ? (
                  <SkeletonLoader width="140px" height="16px" />
                ) : (
                  <TextBase variant="h6">{title || '\u00A0'}</TextBase>
                )}
                <VideoCountContainer>
                  {loading ? (
                    <SkeletonLoader width="140px" height="16px" />
                  ) : (
                    <CSSTransition
                      in={!!videoCount}
                      timeout={parseInt(transitions.timings.loading) * 0.5}
                      classNames={transitions.names.fade}
                    >
                      <VideoCount variant="subtitle2">
                        {videoCount && variant === 'primary' ? `${videoCount} Uploads` : null}
                        {follows && variant === 'secondary' ? followersLabel : '0 Followers'}
                      </VideoCount>
                    </CSSTransition>
                  )}
                </VideoCountContainer>
                {variant === 'secondary' && (
                  <FollowButton variant="secondary" onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </FollowButton>
                )}
              </Info>
            </InnerContainer>
          </CSSTransition>
        </SwitchTransition>
      </Anchor>
    </OuterContainer>
  )
}
