import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { AvatarSize } from '@/shared/components/Avatar'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { transitions } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

import { Container, StyledAvatar, StyledText } from './ChannelLink.style'

type ChannelLinkProps = {
  id?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  hideHandle?: boolean
  hideAvatar?: boolean
  variant?: 'primary' | 'secondary'
  noLink?: boolean
  overrideChannel?: BasicChannelFieldsFragment
  avatarSize?: AvatarSize
  className?: string
  onNotFound?: () => void
}

export const ChannelLink: React.FC<ChannelLinkProps> = ({
  id,
  hideHandle,
  hideAvatar,
  variant = 'primary',
  noLink,
  overrideChannel,
  avatarSize = 'default',
  onNotFound,
  className,
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
  const isSecondary = variant === 'secondary'

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
              <StyledText variant={isSecondary ? 'button2' : 'h6'} isSecondary={isSecondary}>
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
