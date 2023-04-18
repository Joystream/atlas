import { useState } from 'react'

import { useBasicChannelsConnection } from '@/api/hooks/channelsConnection'
import { ChannelOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { Section } from '@/components/Section/Section'
import { ChannelCard } from '@/components/_channel/ChannelCard'

export const ChannelsSection = () => {
  const [sortBy, setSortBy] = useState<string>('Most followed')
  const {
    edges: channels,
    pageInfo,
    loading,
    fetchMore,
  } = useBasicChannelsConnection({
    orderBy:
      sortBy === 'Newest'
        ? ChannelOrderByInput.CreatedAtDesc
        : sortBy === 'Oldest'
        ? ChannelOrderByInput.CreatedAtAsc
        : ChannelOrderByInput.FollowsNumDesc,
    first: 10,
  })
  const [isLoading, setIsLoading] = useState(false)

  if (!channels || (!channels?.length && !(loading || isLoading))) {
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
        children: channels.map(({ node }) => <ChannelCard key={node.id} channel={node} />),
      }}
      footerProps={{
        type: 'infinite',
        reachedEnd: !pageInfo?.hasNextPage ?? true,
        fetchMore: async () => {
          setIsLoading(true)
          await fetchMore({
            variables: {
              after: pageInfo?.endCursor,
            },
          }).finally(() => {
            setIsLoading(false)
          })
        },
      }}
    />
  )
}
