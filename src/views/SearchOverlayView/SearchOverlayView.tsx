import React, { useEffect } from 'react'
import { useRouterQuery } from '@/hooks'
import RecentSearches from './RecentSearches'
import SearchResults from './SearchResults'
import styled from '@emotion/styled'
import { colors, zIndex } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { SIDENAVBAR_WIDTH } from '@/components'
import { QUERY_PARAMS } from '@/config/routes'

const SearchOverlayView: React.FC = () => {
  const searchQuery = useRouterQuery(QUERY_PARAMS.SEARCH)

  // TODO we should probably handle that in one place for all the overlays
  // prevent body scroll
  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden')

    return () => {
      document.body.style.setProperty('overflow', null)
    }
  }, [])

  return (
    <OverlayContainer role="dialog">
      {searchQuery ? <SearchResults query={searchQuery} /> : <RecentSearches />}
    </OverlayContainer>
  )
}

const OverlayContainer = styled.div`
  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: ${SIDENAVBAR_WIDTH}px;
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  background-color: ${colors.black};
  padding: 0 var(--global-horizontal-padding);
  overflow: auto;
`

export default SearchOverlayView
