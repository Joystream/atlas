import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { AvatarSize } from '@/components/Avatar'
import { Text, TextVariant } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import { Container, StyledAvatar } from './ChannelLink.styles'

type ChannelLinkProps = {
  id?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  hideHandle?: boolean
  hideAvatar?: boolean
  noLink?: boolean
  overrideChannel?: BasicChannelFieldsFragment
  avatarSize?: AvatarSize
  className?: string
  onNotFound?: () => void
  textVariant?: TextVariant
  textSecondary?: boolean
}

export const ChannelLink: React.FC<ChannelLinkProps> = ({
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
}) => {
  const { channel } = useBasicChannel(id || '', {
    skip: !id,
    onCompleted: (data) => !data && onNotFound?.(),
    onError: (error) => SentryLogger.error('Failed to fetch channel', 'ChannelLink', error, { channel: { id } }),
  })
  const { url: avatarPhotoUrl } = useAsset(channel?.avatarPhoto)

  const displayedChannel = overrideChannel || channel

  const _textVariant = textVariant ?? textSecondary ? 't200-strong' : 't300-strong'
  return (
    <Container onClick={onClick} to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && (
        <StyledAvatar
          withHandle={!hideHandle}
          loading={!displayedChannel}
          size={avatarSize}
          assetUrl={avatarPhotoUrl}
        />
      )}
      {!hideHandle && (
        <SwitchTransition>
          <CSSTransition
            key={displayedChannel ? 'data' : 'placeholder'}
            classNames={transitions.names.fade}
            timeout={parseInt(transitions.timings.regular)}
          >
            {displayedChannel ? (
              <Text variant={_textVariant} secondary={!!textSecondary}>
                {displayedChannel.title}
              </Text>
            ) : (
              <SkeletonLoader height={16} width={150} />
            )}
          </CSSTransition>
        </SwitchTransition>
      )}
    </Container>
  )
}
