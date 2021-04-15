import React from 'react'
import Avatar, { AvatarSize } from '@/shared/components/Avatar'
import { absoluteRoutes } from '@/config/routes'
import { Container, Handle, HandlePlaceholder } from './ChannelLink.style'
import { useBasicChannel } from '@/api/hooks'
import { BasicChannelFieldsFragment } from '@/api/queries'
import { createUrlFromAsset } from '@/utils/asset'

type ChannelLinkProps = {
  id?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  hideHandle?: boolean
  hideAvatar?: boolean
  noLink?: boolean
  overrideChannel?: BasicChannelFieldsFragment
  avatarSize?: AvatarSize
  className?: string
}

const ChannelLink: React.FC<ChannelLinkProps> = ({
  id,
  hideHandle,
  hideAvatar,
  noLink,
  overrideChannel,
  avatarSize = 'default',
  className,
}) => {
  const { channel } = useBasicChannel(id || '', { fetchPolicy: 'cache-first', skip: !id })

  const displayedChannel = overrideChannel || channel

  const avatarPhotoUrl = createUrlFromAsset(
    displayedChannel?.avatarPhotoAvailability,
    displayedChannel?.avatarPhotoUrls,
    displayedChannel?.avatarPhotoDataObject
  )

  return (
    <Container to={absoluteRoutes.viewer.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && <Avatar imageUrl={avatarPhotoUrl} loading={!displayedChannel} size={avatarSize} />}
      {!hideHandle &&
        (displayedChannel ? (
          <Handle withAvatar={!hideAvatar}>{displayedChannel.title}</Handle>
        ) : (
          <HandlePlaceholder withAvatar={!hideAvatar} height={16} width={150} />
        ))}
    </Container>
  )
}

export default ChannelLink
