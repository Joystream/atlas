import React, { useEffect } from 'react'
import { useRouterQuery } from '@/hooks'
import RecentSearches from './RecentSearches'
import SearchResults from './SearchResults'
import styled from '@emotion/styled'
import { colors, zIndex } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'

// TODO: import
const SEARCH_QUERY_PARAM = 'query'

const SearchOverlayView: React.FC = () => {
  const searchQuery = useRouterQuery(SEARCH_QUERY_PARAM)

  // TODO we should probably handle that in one place for all the overlays
  // prevent body scroll
  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden')

    return () => {
      document.body.style.setProperty('overflow', null)
    }
  }, [])

  return <OverlayContainer>{searchQuery ? <SearchResults query={searchQuery} /> : <RecentSearches />}</OverlayContainer>
}

const OverlayContainer = styled.div`
  position: absolute;
  z-index: ${zIndex.nearOverlay};
  top: 0;
  left: 0;
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  background-color: ${colors.black};
  padding: 0 var(--global-horizontal-padding);
  overflow: auto;
`

export default SearchOverlayView
