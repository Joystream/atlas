import React from 'react'
import { ChannelPreviewBase } from '@/shared/components'
import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import { absoluteRoutes } from '@/config/routes'
import { getImageUrlFromAsset } from '@/utils/image'

type ChannelPreviewProps = {
  id?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ChannelPreview: React.FC<ChannelPreviewProps> = ({ id, className, onClick }) => {
  const { channel, loading } = useChannel(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const { videoCount } = useChannelVideoCount(id ?? '', {
    fetchPolicy: 'cache-first',
    skip: !id,
  })
  const isLoading = loading || id === undefined
  return (
    <ChannelPreviewBase
      className={className}
      avatarUrl={getImageUrlFromAsset(channel?.avatarPhoto)}
      title={channel?.title}
      channelHref={id ? absoluteRoutes.viewer.channel(id) : undefined}
      videoCount={videoCount}
      loading={isLoading}
      onClick={onClick}
    />
  )
}

export default ChannelPreview
