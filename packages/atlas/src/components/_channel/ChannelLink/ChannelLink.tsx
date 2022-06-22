import { FC, MouseEvent } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { AvatarSize } from '@/components/Avatar'
import { Text, TextVariant } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { useAsset } from '@/providers/assets'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import { Container, FollowButton, StyledAvatar, StyledLink, TitleWrapper } from './ChannelLink.styles'

export type ChannelLinkProps = {
  id?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  hideHandle?: boolean
  hideAvatar?: boolean
  noLink?: boolean
  overrideChannel?: BasicChannelFieldsFragment
  avatarSize?: AvatarSize
  className?: string
  onNotFound?: () => void
  textVariant?: TextVariant
  textSecondary?: boolean
  customTitle?: string
  followButton?: boolean
}

export const ChannelLink: FC<ChannelLinkProps> = ({
  id,
  onClick,
  hideHandle,
  hideAvatar,
  noLink,
  overrideChannel,
  avatarSize = 'default',
  onNotFound,
  className,
  textVariant,
  textSecondary,
  customTitle,
  followButton = false,
}) => {
  const { channel } = useBasicChannel(id || '', {
    skip: !id,
    onCompleted: (data) => !data && onNotFound?.(),
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelLink', error, { channel: { id } }),
  })
  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channel?.id, channel?.title)
  const { url: avatarPhotoUrl } = useAsset(channel?.avatarPhoto)

  const displayedChannel = overrideChannel || channel

  const handleFollowButtonClick = (e: MouseEvent) => {
    e.preventDefault()
    toggleFollowing()
  }

  const _textVariant = textVariant || 't200-strong'
  return (
    <Container className={className}>
      {!hideAvatar && (
        <StyledLink onClick={onClick} to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink}>
          <StyledAvatar
            withHandle={!hideHandle}
            loading={!displayedChannel}
            size={avatarSize}
            assetUrl={avatarPhotoUrl}
          />
        </StyledLink>
      )}
      {!hideHandle && (
        <SwitchTransition>
          <CSSTransition
            key={displayedChannel ? 'data' : 'placeholder'}
            classNames={transitions.names.fade}
            timeout={parseInt(transitions.timings.regular)}
          >
            {displayedChannel ? (
              <TitleWrapper followButton={followButton}>
                <StyledLink onClick={onClick} to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink}>
                  <Text as="span" variant={_textVariant} color={textSecondary ? 'colorCoreNeutral200' : undefined}>
                    {customTitle || displayedChannel?.title}
                  </Text>
                  {followButton && (
                    <Text as="p" variant="t100" color="colorText" margin={{ top: 1 }}>
                      {displayedChannel.follows} {displayedChannel.follows === 1 ? 'follower' : 'followers'}
                    </Text>
                  )}
                </StyledLink>
                {followButton && (
                  <FollowButton variant="secondary" onClick={handleFollowButtonClick}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </FollowButton>
                )}
              </TitleWrapper>
            ) : (
              <SkeletonLoader height={16} width={150} />
            )}
          </CSSTransition>
        </SwitchTransition>
      )}
    </Container>
  )
}
