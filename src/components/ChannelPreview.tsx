import React, { useEffect } from 'react'

import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/hooks'
import { ChannelPreviewBase } from '@/shared/components'
import { Logger } from '@/utils/logger'

type ChannelPreviewProps = {
  id?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ChannelPreview: React.FC<ChannelPreviewProps> = ({ id, className, onClick }) => {
  const { channel, loading } = useChannel(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const { url, error: assetError } = useAsset({ entity: channel, assetType: AssetType.AVATAR })
  const { videoCount } = useChannelVideoCount(id ?? '', {
    fetchPolicy: 'cache-first',
    skip: !id,
  })
  const isLoading = loading || id === undefined

  useEffect(() => {
    if (assetError) {
      Logger.error('Failed to load avatar image')
    }
  }, [assetError])

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
