import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SearchQuery, VideoFieldsFragment, useSearchLazyQuery } from '@/api/queries'

export const usePagination = (currentTab: number) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSearchPage, setCurrentSearchPage] = useState(0)
  // reset the pagination when changing tabs
  useEffect(() => {
    setCurrentPage(0)
    setCurrentSearchPage(0)
  }, [currentTab])
  return { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage }
}

const getVideosFromSearch = (loading: boolean, data: SearchQuery['search'] | undefined) => {
  if (loading || !data) {
    return { channels: [], videos: [] }
  }
  const searchVideos: Array<{ __typename?: 'Video' } & VideoFieldsFragment> = data.flatMap((result) =>
    result.item.__typename === 'Video' ? [result.item] : []
  )
  return { searchVideos }
}
type UseSearchVideosParams = {
  id: string
  onError: (error: unknown) => void
}

export const useSearchVideos = ({ id, onError }: UseSearchVideosParams) => {
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVideo, { loading: loadingSearch, data: searchData, error: errorSearch }] = useSearchLazyQuery({
    onError,
  })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const search = useCallback(
    (searchQuery: string) => {
      setSearchQuery(searchQuery)
      searchVideo({
        variables: {
          text: searchQuery,
          whereVideo: {
            channel: {
              id_eq: id,
            },
            isPublic_eq: true,
            isCensored_eq: false,
            thumbnailPhoto: {
              isAccepted_eq: true,
            },
            media: {
              isAccepted_eq: true,
            },
          },
          limit: 100,
        },
      })
    },
    [id, searchVideo]
  )

  const { searchVideos } = useMemo(
    () => getVideosFromSearch(loadingSearch, searchData?.search),
    [loadingSearch, searchData]
  )

  return {
    searchVideos,
    search,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    errorSearch,
    isSearching,
    setIsSearching,
    searchInputRef,
    searchQuery,
  }
}
