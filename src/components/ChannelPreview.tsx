import React from 'react'

import { useChannel } from '@/api/hooks'
import { useChannelVideoCount } from '@/api/hooks/channel'
import { absoluteRoutes } from '@/config/routes'
import { ChannelPreviewBase, AssetImage, ImageType } from '@/shared/components'

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
    <AssetImage
      entity={channel}
      imageType={ImageType.AVATAR}
      component={
        <ChannelPreviewBase
          className={className}
          title={channel?.title}
          channelHref={id ? absoluteRoutes.viewer.channel(id) : undefined}
          videoCount={videoCount}
          loading={isLoading}
          onClick={onClick}
        />
      }
    />
  )
}
