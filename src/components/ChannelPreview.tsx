import React from 'react'

import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/hooks'
import { ChannelPreviewBase } from '@/shared/components'

type ChannelPreviewProps = {
  id?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ChannelPreview: React.FC<ChannelPreviewProps> = ({ id, className, onClick }) => {
  const [{ url }, getAssetUrl] = useAsset()
  const { channel, loading } = useChannel(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const { videoCount } = useChannelVideoCount(id ?? '', {
    fetchPolicy: 'cache-first',
    skip: !id,
  })
  const isLoading = loading || id === undefined
  getAssetUrl(channel?.avatarPhotoAvailability, channel?.avatarPhotoUrls, channel?.avatarPhotoDataObject)

  return (
    <ChannelPreviewBase
      className={className}
      title={channel?.title}
      channelHref={id ? absoluteRoutes.viewer.channel(id) : undefined}
      videoCount={videoCount}
      loading={isLoading}
      onClick={onClick}
      assetUrl={url}
    />
  )
}
