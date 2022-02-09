import React from 'react'

import { QUERY_PARAMS } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useRouterQuery } from '@/hooks/useRouterQuery'

import { SearchResults } from './SearchResults'

export const SearchView: React.FC = () => {
  const searchQuery = useRouterQuery(QUERY_PARAMS.SEARCH)
  const headTags = useHeadTags(searchQuery)

  return (
    <>
      {headTags}
      <SearchResults query={searchQuery || ''} />
    </>
  )
}
