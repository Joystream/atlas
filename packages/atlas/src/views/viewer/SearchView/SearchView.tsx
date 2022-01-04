import React from 'react'

import { QUERY_PARAMS } from '@/config/routes'
import { useRouterQuery } from '@/hooks/useRouterQuery'

import { SearchResults } from './SearchResults'

export const SearchView: React.FC = () => {
  const searchQuery = useRouterQuery(QUERY_PARAMS.SEARCH)

  return <SearchResults query={searchQuery || ''} />
}
