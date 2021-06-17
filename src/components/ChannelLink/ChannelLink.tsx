import React, { useEffect } from 'react'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/hooks'
import { Avatar, AvatarSize } from '@/shared/components/Avatar'
import { Logger } from '@/utils/logger'

import { Container, Handle, HandlePlaceholder } from './ChannelLink.style'

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
}) => {
  const { channel } = useBasicChannel(id || '', {
    skip: !id,
    onCompleted: (data) => !data && onNotFound?.(),
    onError: (error) => Logger.error('Failed to fetch channel', error),
  })
  const { url: avatarPhotoUrl, error: avatarPhotoError } = useAsset({
    entity: channel,
    assetType: AssetType.AVATAR,
  })

  const displayedChannel = overrideChannel || channel

  useEffect(() => {
    if (avatarPhotoError) {
      Logger.error('Failed to load avatar')
    }
  }, [avatarPhotoError])

  return (
    <Container to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && <Avatar loading={!displayedChannel} size={avatarSize} assetUrl={avatarPhotoUrl} />}
      {!hideHandle &&
        (displayedChannel ? (
          <Handle withAvatar={!hideAvatar}>{displayedChannel.title}</Handle>
        ) : (
          <HandlePlaceholder withAvatar={!hideAvatar} height={16} width={150} />
        ))}
    </Container>
  )
}
