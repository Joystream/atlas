import { useState } from 'react'

import { useBasicChannelsConnection } from '@/api/hooks/channelsConnection'
import { ChannelOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { Section } from '@/components/Section/Section'
import { ChannelCard } from '@/components/_channel/ChannelCard'

const sortingOptions = [
  {
    label: 'Newest',
    value: ChannelOrderByInput.CreatedAtDesc,
  },
  {
    label: 'Oldest',
    value: ChannelOrderByInput.CreatedAtAsc,
  },
  {
    label: 'Most followed',
    value: ChannelOrderByInput.FollowsNumDesc,
  },
]

export const ChannelsSection = () => {
  const [sortBy, setSortBy] = useState(ChannelOrderByInput.FollowsNumDesc)
  const {
    edges: channels,
    pageInfo,
    loading,
    fetchMore,
  } = useBasicChannelsConnection({
    orderBy: sortBy,
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
            options: sortingOptions,
            value: sortBy,
            onChange: setSortBy,
          },
        },
      }}
      contentProps={{
        type: 'grid',
        grid: {
          sm: {
            columns: 2,
          },
          md: {
            columns: 3,
          },
          lg: {
            columns: 4,
          },
          xl: {
            columns: 5,
          },
          xxl: {
            columns: 6,
          },
        },
        children: channels.map(({ node }) => <ChannelCard key={node.id} channel={node} />),
      }}
      footerProps={{
        type: 'load',
        label: 'Load more channels',
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
