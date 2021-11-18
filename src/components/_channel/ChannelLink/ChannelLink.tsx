import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { AvatarSize } from '@/components/Avatar'
import { TextVariant } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { transitions } from '@/theme'
import { SentryLogger } from '@/utils/logs'

import { Container, StyledAvatar, StyledText } from './ChannelLink.styles'

type ChannelLinkProps = {
  id?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
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
  const { url: avatarPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })

  const displayedChannel = overrideChannel || channel

  const _textVariant = textVariant ?? textSecondary ? 'button2' : 'h6'
  return (
    <Container to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink} className={className}>
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
              <StyledText variant={_textVariant} isSecondary={!!textSecondary}>
                {displayedChannel.title}
              </StyledText>
            ) : (
              <SkeletonLoader height={16} width={150} />
            )}
          </CSSTransition>
        </SwitchTransition>
      )}
    </Container>
  )
}
