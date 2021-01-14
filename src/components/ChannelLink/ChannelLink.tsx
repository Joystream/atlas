import React, { useMemo } from 'react'
import { useApolloClient } from '@apollo/client'
import { basicChannelFieldsFragment } from '@/api/queries'
import { GetChannelVariables } from '@/api/queries/__generated__/GetChannel'
import { BasicChannelFields } from '@/api/queries/__generated__/BasicChannelFields'
import Avatar, { AvatarSize } from '@/shared/components/Avatar'
import routes from '@/config/routes'
import { Container, Handle, HandlePlaceholder } from './ChannelLink.style'

type ChannelLinkProps = {
  id?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  hideHandle?: boolean
  hideAvatar?: boolean
  noLink?: boolean
  overrideChannel?: BasicChannelFields
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
  const client = useApolloClient()

  const channel = useMemo(() => {
    if (!id) {
      return null
    }
    return client.readFragment<BasicChannelFields, GetChannelVariables>({
      fragment: basicChannelFieldsFragment,
      id: `Channel:${id}`,
    })
  }, [id, client])

  const displayedChannel = overrideChannel || channel

  return (
    <Container to={routes.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && (
        <Avatar
          handle={displayedChannel?.handle}
          imageUrl={displayedChannel?.avatarPhotoUrl}
          loading={!displayedChannel}
          size={avatarSize}
        />
      )}
      {!hideHandle &&
        (displayedChannel ? (
          <Handle withAvatar={!hideAvatar}>{displayedChannel.handle}</Handle>
        ) : (
          <HandlePlaceholder withAvatar={!hideAvatar} height={16} width={150} />
        ))}
    </Container>
  )
}

export default ChannelLink
