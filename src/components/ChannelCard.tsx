import React from 'react'

import { useChannel } from '@/api/hooks'
import { useHandleFollowChannel } from '@/hooks'
import { AssetType, useAsset } from '@/providers'
import { ChannelCardBase } from '@/shared/components'

export type ChannelCardProps = {
  id?: string
  rankingNumber?: number
  isLoading?: boolean
  className?: string
  onClick?: () => void
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ id, rankingNumber, isLoading, className }) => {
  const { channel } = useChannel(id ?? '', { skip: !id })
  const { url } = useAsset({ entity: channel, assetType: AssetType.AVATAR })

  const { toggleFollowing, isFollowing } = useHandleFollowChannel(id)

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFollowing()
  }

  return (
    <ChannelCardBase
      className={className}
      isLoading={isLoading}
      id={channel?.id}
      avatarUrl={url}
      follows={channel?.follows}
      onFollow={handleFollow}
      isFollowing={isFollowing}
      rankingNumber={rankingNumber}
      title={channel?.title}
    />
  )
}
