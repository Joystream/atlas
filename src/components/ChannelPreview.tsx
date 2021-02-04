import React from 'react'
import ChannelPreviewBase from '../shared/components/ChannelPreview/ChannelPreviewBase'
import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import routes from '@/config/routes'

type ChannelPreviewProps = {
  id: string
  animated?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const ChannelPreview: React.FC<ChannelPreviewProps> = ({ id, className, animated = false, onClick }) => {
  const { channel, loading } = useChannel(id, { fetchPolicy: 'cache-first', skip: !id })
  const { videoCount, loading: loadingVideoCount } = useChannelVideoCount(id, { fetchPolicy: 'cache-first', skip: !id })

  return (
    <ChannelPreviewBase
      className={className}
      avatarURL={channel?.avatarPhotoUrl ?? undefined}
      name={channel?.handle}
      channelHref={routes.channel(id)}
      videoCount={videoCount}
      animated={animated}
      loading={loading || loadingVideoCount}
      onClick={onClick}
    />
  )
}

export default ChannelPreview
