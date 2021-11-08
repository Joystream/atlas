import React from 'react'

import { useMostFollowedChannelsAllTime } from '@/api/hooks'

import { ChannelGallery } from '../ChannelGallery'

export const TopTenChannels = () => {
  const { channels, loading } = useMostFollowedChannelsAllTime({ limit: 10 })

  return (
    <section>
      <ChannelGallery hasRanking channels={channels} loading={loading} title="Top 10 Channels" />
    </section>
  )
}
