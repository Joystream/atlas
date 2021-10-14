import { debounce } from 'lodash-es'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useSearch } from '@/api/hooks'
import { AssetAvailability, SearchQuery } from '@/api/queries'
import { SentryLogger } from '@/utils/logs'

export const useSearchResults = (searchQuery: string, limit = 50) => {
  const [text, setText] = useState(searchQuery)
  const debouncedQuery = useRef(
    debounce((query: string) => {
      setText(query)
    }, 500)
  )

  useEffect(() => {
    debouncedQuery.current(searchQuery)
  }, [searchQuery])

  const { data, loading, error } = useSearch(
    {
      text,
      limit,
      whereVideo: {
        mediaAvailability_eq: AssetAvailability.Accepted,
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
      },
      whereChannel: {},
    },
    {
      skip: !searchQuery,
      onError: (error) => SentryLogger.error('Failed to fetch search results', 'SearchResults', error),
    }
  )

  const getChannelsAndVideos = (loading: boolean, data: SearchQuery['search'] | undefined) => {
    if (loading || !data) {
      return { channels: [], videos: [] }
    }
    const results = data
    const videos = results.flatMap((result) => (result.item.__typename === 'Video' ? [result.item] : []))
    const channels = results.flatMap((result) => (result.item.__typename === 'Channel' ? [result.item] : []))
    return { channels, videos }
  }

  const { channels, videos } = useMemo(() => getChannelsAndVideos(loading, data), [loading, data])

  return {
    channels,
    videos,
    error,
    loading,
  }
}
