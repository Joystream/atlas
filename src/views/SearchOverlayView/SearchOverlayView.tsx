import React from 'react'
import { useRouterQuery } from '@/hooks'
import RecentSearches from './RecentSearches'
import SearchResults from './SearchResults'

const SEARCH_QUERY_PARAM = 'query'

const SearchOverlayView: React.FC = () => {
  const searchQuery = useRouterQuery(SEARCH_QUERY_PARAM)

  if (searchQuery) {
    // TODO return search results
    return <SearchResults query={searchQuery} />
  }

  return <RecentSearches />
}

export default SearchOverlayView
