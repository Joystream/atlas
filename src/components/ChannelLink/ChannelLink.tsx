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
  avatarSize?: AvatarSize
  className?: string
}

const ChannelLink: React.FC<ChannelLinkProps> = ({
  id,
  hideHandle,
  hideAvatar,
  noLink,
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

  return (
    <Container to={routes.channel(id)} disabled={!id || noLink} className={className}>
      {!hideAvatar && (
        <Avatar handle={channel?.handle} imageUrl={channel?.avatarPhotoUrl} loading={!channel} size={avatarSize} />
      )}
      {!hideHandle &&
        (channel ? (
          <Handle withAvatar={!hideAvatar}>{channel.handle}</Handle>
        ) : (
          <HandlePlaceholder withAvatar={!hideAvatar} height={16} width={150} />
        ))}
    </Container>
  )
}

export default ChannelLink
