import React from 'react'
import ChannelPreviewBase from '../shared/components/ChannelPreview/ChannelPreviewBase'
import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import routes from '@/config/routes'

type ChannelPreviewProps = {
  id?: string
  animated?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const ChannelPreview: React.FC<ChannelPreviewProps> = ({ id, className, animated, onClick }) => {
  const { channel, loading } = useChannel(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const { videoCount } = useChannelVideoCount(id ?? '', {
    fetchPolicy: 'cache-first',
    skip: !id,
  })
  const isLoading = loading || id === undefined
  return (
    <ChannelPreviewBase
      className={className}
      avatarURL={channel?.avatarPhotoUrl ?? undefined}
      name={channel?.handle}
      channelHref={routes.channel(id)}
      videoCount={videoCount}
      animated={animated}
      loading={isLoading}
      onClick={onClick}
    />
  )
}

export default ChannelPreview
