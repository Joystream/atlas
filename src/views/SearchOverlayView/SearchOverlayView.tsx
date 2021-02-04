import React from 'react'
import { useRouterQuery } from '@/hooks'
import RecentSearches from './RecentSearches'
import SearchResults from './SearchResults'
import styled from '@emotion/styled'
import { colors, zIndex } from '@/shared/theme'

const SEARCH_QUERY_PARAM = 'query'

const SearchOverlayView: React.FC = () => {
  const searchQuery = useRouterQuery(SEARCH_QUERY_PARAM)

  return <OverlayContainer>{searchQuery ? <SearchResults query={searchQuery} /> : <RecentSearches />}</OverlayContainer>
}

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${zIndex.nearOverlay};
  background-color: ${colors.black};
  padding: 0 var(--global-horizontal-padding); ;
`

export default SearchOverlayView
