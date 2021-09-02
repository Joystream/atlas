import React from 'react'

import { useChannel } from '@/api/hooks'
import { useHandleFollowChannel } from '@/hooks'
import { AssetType, useAsset } from '@/providers/assets'
import { ChannelCardBase } from '@/shared/components/ChannelCardBase'

export type ChannelCardProps = {
  id?: string
  className?: string
  onClick?: () => void
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ id, className }) => {
  const { channel, loading } = useChannel(id ?? '', { skip: !id })
  const { url, isLoadingAsset } = useAsset({ entity: channel, assetType: AssetType.AVATAR })

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(id, channel?.title)

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFollowing()
  }

  return (
    <ChannelCardBase
      className={className}
      isLoading={loading || !channel}
      isLoadingAvatar={isLoadingAsset}
      id={channel?.id}
      avatarUrl={url}
      follows={channel?.follows}
      onFollow={handleFollow}
      isFollowing={isFollowing}
      title={channel?.title}
    />
  )
}
