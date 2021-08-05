import React from 'react'

import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { ChannelCardBase } from '@/shared/components'

type ChannelCardProps = {
  id?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  variant?: 'primary' | 'secondary'
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ id, className, onClick, variant = 'primary' }) => {
  const { channel, loading } = useChannel(id ?? '', { fetchPolicy: 'cache-first', skip: !id })
  const { url } = useAsset({ entity: channel, assetType: AssetType.AVATAR })
  const { videoCount } = useChannelVideoCount(id ?? '', undefined, {
    fetchPolicy: 'cache-first',
    skip: !id,
  })
  const isLoading = loading || id === undefined

  return (
    <ChannelCardBase
      className={className}
      title={channel?.title}
      channelHref={id ? absoluteRoutes.viewer.channel(id) : undefined}
      videoCount={videoCount}
      loading={isLoading}
      onClick={onClick}
      assetUrl={url}
      variant={variant}
      follows={channel?.follows}
      channelId={id}
    />
  )
}
