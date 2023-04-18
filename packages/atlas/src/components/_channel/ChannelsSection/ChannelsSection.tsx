import { useState } from 'react'

import { useBasicChannels } from '@/api/hooks/channel'
import { ChannelOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { Section } from '@/components/Section/Section'
import { ChannelCard } from '@/components/_channel/ChannelCard'

export const ChannelsSection = () => {
  const [sortBy, setSortBy] = useState<string>('Most followed')
  const { extendedChannels, loading } = useBasicChannels({
    orderBy:
      sortBy === 'Newest'
        ? ChannelOrderByInput.CreatedAtDesc
        : sortBy === 'Oldest'
        ? ChannelOrderByInput.CreatedAtAsc
        : ChannelOrderByInput.FollowsNumDesc,
  })

  if (!extendedChannels || (!extendedChannels?.length && !loading)) {
    return null
  }

  return (
    <Section
      headerProps={{
        start: {
          title: 'Channels',
          type: 'title',
        },
        sort: {
          type: 'toggle-button',
          toggleButtonOptionTypeProps: {
            type: 'options',
            options: ['Newest', 'Oldest', 'Most followed'],
            value: sortBy,
            onChange: setSortBy,
          },
        },
      }}
      contentProps={{
        type: 'grid',
        minChildrenWidth: 200,
        children: extendedChannels.map((extended) => (
          <ChannelCard key={extended.channel.id} channel={extended.channel} />
        )),
      }}
    />
  )
}
