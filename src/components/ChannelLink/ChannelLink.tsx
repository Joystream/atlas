import React from 'react'

import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import AssetImage, { ImageType } from '@/shared/components/AssetImage'
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

  const displayedChannel = overrideChannel || channel

  return (
    <Container to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && (
        <AssetImage
          entity={displayedChannel}
          component={<Avatar loading={!displayedChannel} size={avatarSize} />}
          imageType={ImageType.AVATAR}
        />
      )}
      {!hideHandle &&
        (displayedChannel ? (
          <Handle withAvatar={!hideAvatar}>{displayedChannel.title}</Handle>
        ) : (
          <HandlePlaceholder withAvatar={!hideAvatar} height={16} width={150} />
        ))}
    </Container>
  )
}
