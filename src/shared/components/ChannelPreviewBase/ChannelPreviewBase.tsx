import React, { useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useFollowChannel, useUnfollowChannel } from '@/api/hooks'
import { usePersonalDataStore } from '@/providers'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'

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
} from './ChannelPreviewBase.style'

import { Placeholder } from '../Placeholder'

export type ChannelPreviewBaseProps = {
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

export const ChannelPreviewBase: React.FC<ChannelPreviewBaseProps> = ({
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
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const [isFollowing, setFollowing] = useState<boolean>()
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)
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

  useEffect(() => {
    const isFollowing = followedChannels.some((channel) => channel.id === channelId)
    setFollowing(isFollowing)
  }, [followedChannels, channelId])

  // @ts-ignore test
  const onFollowClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    if (channelId) {
      try {
        if (isFollowing) {
          updateChannelFollowing(channelId, false)
          unfollowChannel(channelId)
          setFollowing(false)
        } else {
          updateChannelFollowing(channelId, true)
          followChannel(channelId)
          setFollowing(true)
        }
      } catch (error) {
        Logger.warn('Failed to update Channel following', { error })
      }
    }
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
                {loading ? <Placeholder rounded /> : <StyledAvatar assetUrl={assetUrl} />}
              </AvatarContainer>
              <Info>
                {loading ? (
                  <Placeholder width="140px" height="16px" />
                ) : (
                  <TextBase variant="h6">{title || '\u00A0'}</TextBase>
                )}
                <VideoCountContainer>
                  {loading ? (
                    <Placeholder width="140px" height="16px" />
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
                  <FollowButton variant="secondary" onClick={onFollowClick}>
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
