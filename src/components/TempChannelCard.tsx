import React from 'react'

import { useChannel } from '@/api/hooks'
import { useHandleFollowChannel } from '@/hooks'
import { AssetType, useAsset } from '@/providers'
import { TempChannelCardBase } from '@/shared/components'

export type ChannelCardProps = {
  id?: string
  rankingNumber?: number
  isLoading?: boolean
}

export const TempChannelCard: React.FC<ChannelCardProps> = ({ id, rankingNumber, isLoading }) => {
  const { channel } = useChannel(id ?? '', { skip: !id })
  const { url } = useAsset({ entity: channel, assetType: AssetType.AVATAR })

  const { followChannel, isFollowing } = useHandleFollowChannel(id)

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    followChannel()
  }

  return (
    <TempChannelCardBase
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
