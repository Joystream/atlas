import { useCallback, useEffect, useState } from 'react'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useGetBasicVideosConnectionLazyQuery } from '@/api/queries/__generated__/videos.generated'

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

type UseSearchVideosParams = {
  id: string
  onError: (error: unknown) => void
}

export const useSearchVideos = ({ id, onError }: UseSearchVideosParams) => {
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVideo, { loading: loadingSearch, data: searchData, error: searchError, variables }] =
    useGetBasicVideosConnectionLazyQuery({
      onError,
    })

  const submitSearch = useCallback(
    (searchQuery: string) => {
      searchVideo({
        variables: {
          where: {
            channel: {
              id_eq: id,
            },
            ...(searchQuery ? { title_containsInsensitive: searchQuery } : {}),
            isPublic_eq: true,
            isCensored_eq: false,
            thumbnailPhoto: {
              isAccepted_eq: true,
            },
            media: {
              isAccepted_eq: true,
            },
          },
          orderBy: [VideoOrderByInput.CreatedAtDesc],
        },
      })
    },
    [id, searchVideo]
  )

  return {
    foundVideos: searchData?.videosConnection.edges.map((edge) => edge.node),
    submitSearch,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    searchError,
    isSearching,
    setIsSearching,
    searchedText: isSearching ? (variables?.where?.title_containsInsensitive as string) : undefined,
    searchQuery,
    setSearchQuery,
  }
}
