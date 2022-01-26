import { debounce } from 'lodash-es'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useSearch } from '@/api/hooks'
import { VideoWhereInput } from '@/api/queries'
import { SearchQuery } from '@/api/queries'
import { SentryLogger } from '@/utils/logs'

type SearchResultData = {
  searchQuery: string
  limit?: number
  videoWhereInput?: VideoWhereInput
}

export const useSearchResults = ({ searchQuery, limit = 50, videoWhereInput }: SearchResultData) => {
  const [text, setText] = useState(searchQuery)
  const [typing, setTyping] = useState(false)
  const debouncedQuery = useRef(
    debounce((query: string) => {
      setText(query)
      setTyping(false)
    }, 500)
  )

  useEffect(() => {
    if (searchQuery.length) {
      setTyping(true)
      debouncedQuery.current(searchQuery)
    }
  }, [searchQuery])

  const { data, loading, error } = useSearch(
    {
      text,
      limit,
      whereVideo: {
        media: {
          isAccepted_eq: true,
        },
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        isPublic_eq: true,
        isCensored_eq: false,
        ...videoWhereInput,
      },
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
    loading: loading || typing,
  }
}
