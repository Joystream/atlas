import React from 'react'
import { ChannelPreviewBase } from '@/shared/components'
import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/hooks'

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
  const { getAssetUrl } = useAsset()

  const avatarPhotoUrl = getAssetUrl(
    channel?.avatarPhotoAvailability,
    channel?.avatarPhotoUrls,
    channel?.avatarPhotoDataObject
  )
  return (
    <ChannelPreviewBase
      className={className}
      avatarUrl={avatarPhotoUrl}
      title={channel?.title}
      channelHref={id ? absoluteRoutes.viewer.channel(id) : undefined}
      videoCount={videoCount}
      loading={isLoading}
      onClick={onClick}
    />
  )
}

export default ChannelPreview
