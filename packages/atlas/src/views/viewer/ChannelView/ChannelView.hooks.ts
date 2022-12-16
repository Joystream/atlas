import { useCallback, useEffect, useMemo, useState } from 'react'

import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SearchVideosQuery, useSearchVideosLazyQuery } from '@/api/queries/__generated__/search.generated'

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

const getVideosFromSearch = (loading: boolean, data: SearchVideosQuery['searchVideos'] | undefined | null) => {
  if (loading || !data) {
    return { channels: [], videos: [] }
  }
  const foundVideos: Array<{ __typename?: 'Video' } & BasicVideoFieldsFragment> = data.flatMap((result) =>
    result.video.__typename === 'Video' ? [result.video] : []
  )
  return { foundVideos }
}
type UseSearchVideosParams = {
  id: string
  onError: (error: unknown) => void
}

export const useSearchVideos = ({ id, onError }: UseSearchVideosParams) => {
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  // TODO: we should use useVideosLazyQuery here, it's more reliable.
  const [searchVideo, { loading: loadingSearch, data: searchData, error: searchError, variables }] =
    useSearchVideosLazyQuery({
      onError,
    })

  const submitSearch = useCallback(
    (searchQuery: string) => {
      searchVideo({
        variables: {
          query: searchQuery,
          where: {
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

  const { foundVideos } = useMemo(
    () => getVideosFromSearch(loadingSearch, searchData?.searchVideos),
    [loadingSearch, searchData]
  )

  return {
    foundVideos,
    submitSearch,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    searchError,
    isSearching,
    setIsSearching,
    searchedText: isSearching ? variables?.query : undefined,
    searchQuery,
    setSearchQuery,
  }
}
