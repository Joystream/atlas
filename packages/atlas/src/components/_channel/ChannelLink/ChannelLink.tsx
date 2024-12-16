import { FC, MouseEvent } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks/channel'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { AvatarSize } from '@/components/Avatar'
import { ChannelTitle } from '@/components/ChannelTitle'
import { Text, TextVariant } from '@/components/Text'
import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useHandleFollowChannel } from '@/hooks/useHandleFollowChannel'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import { ActionButtons, Container, StyledAvatar, StyledLink } from './ChannelLink.styles'

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
  supportButton?: { onClick?: () => void }
}

export const ChannelLink: FC<ChannelLinkProps> = ({
  id,
  onClick,
  hideHandle,
  hideAvatar,
  noLink,
  overrideChannel,
  avatarSize = 32,
  onNotFound,
  className,
  textVariant,
  textSecondary,
  customTitle,
  followButton = false,
  supportButton,
}) => {
  const { channel } = useBasicChannel(id || '', {
    skip: !id,
    onCompleted: (data) => !data && onNotFound?.(),
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelLink', error, { channel: { id } }),
  })

  const displayedChannel = overrideChannel ? overrideChannel : channel

  const _textVariant = textVariant || 't200-strong'
  return (
    <Container className={className}>
      {!hideAvatar && (
        <StyledLink onClick={onClick} to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink}>
          <StyledAvatar
            withHandle={!hideHandle}
            loading={!displayedChannel}
            size={avatarSize}
            assetUrls={displayedChannel?.avatarPhoto?.resolvedUrls}
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
              <>
                <StyledLink onClick={onClick} to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink}>
                  <ChannelTitle
                    variant={_textVariant}
                    as="span"
                    color={textSecondary ? 'colorCoreNeutral200' : undefined}
                  >
                    {customTitle || displayedChannel.title}
                  </ChannelTitle>
                  {followButton && (
                    <Text as="p" variant="t100" color="colorText" margin={{ top: 1 }}>
                      {displayedChannel.followsNum} {displayedChannel.followsNum === 1 ? 'follower' : 'followers'}
                    </Text>
                  )}
                </StyledLink>
                {(followButton || supportButton) && (
                  <ActionButtons>
                    {followButton && (
                      <FollowButton channelId={displayedChannel?.id} title={displayedChannel?.title ?? undefined} />
                    )}
                    {supportButton && <SupportButton {...supportButton} title={displayedChannel?.title ?? undefined} />}
                  </ActionButtons>
                )}
              </>
            ) : (
              <SkeletonLoader height={16} width={150} />
            )}
          </CSSTransition>
        </SwitchTransition>
      )}
    </Container>
  )
}

const FollowButton = ({ title, channelId }: { title?: string; channelId?: string }) => {
  const { toggleFollowing, isFollowing } = useHandleFollowChannel(channelId, title)
  const handleFollowButtonClick = (e: MouseEvent) => {
    e.preventDefault()
    toggleFollowing()
  }

  return (
    <ProtectedActionWrapper
      title="You want to follow this channel?"
      description={`Sign in to follow ${title || 'this channel'}`}
    >
      <Button variant="primary" onClick={handleFollowButtonClick}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </ProtectedActionWrapper>
  )
}

type SupportButtonProps = {
  onClick?: () => void
  title?: string
}

const SupportButton = ({ onClick, title }: SupportButtonProps) => {
  return (
    <ProtectedActionWrapper
      title="You want to support this channel?"
      description={`Sign in to support ${title || 'this channel'}`}
    >
      <Button variant="secondary" onClick={onClick} disabled={!onClick}>
        Support
      </Button>
    </ProtectedActionWrapper>
  )
}
