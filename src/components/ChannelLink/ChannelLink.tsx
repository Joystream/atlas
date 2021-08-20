import React from 'react'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { Avatar, AvatarSize } from '@/shared/components/Avatar'
import { Logger } from '@/utils/logger'

import { Container, HandleSkeletonLoader, StyledText } from './ChannelLink.style'

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
    onError: (error) => Logger.error('Failed to fetch channel', error),
  })
  const { url: avatarPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })

  const displayedChannel = overrideChannel || channel

  return (
    <Container to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && <Avatar loading={!displayedChannel} size={avatarSize} assetUrl={avatarPhotoUrl} />}
      {!hideHandle &&
        (displayedChannel ? (
          variant === 'secondary' ? (
            <StyledText withAvatar={!hideAvatar} secondary variant="button2">
              {displayedChannel.title}
            </StyledText>
          ) : (
            <StyledText withAvatar={!hideAvatar} variant="h6">
              {displayedChannel.title}
            </StyledText>
          )
        ) : (
          <HandleSkeletonLoader withAvatar={!hideAvatar} height={16} width={150} />
        ))}
    </Container>
  )
}
