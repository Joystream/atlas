import styled from '@emotion/styled'
import React, { useEffect } from 'react'

import { TOP_NAVBAR_HEIGHT } from '@/components/Topbar'
import { QUERY_PARAMS } from '@/config/routes'
import { useRouterQuery } from '@/hooks'
import { useOverlayManager } from '@/providers/overlayManager'
import { colors, zIndex } from '@/shared/theme'

import { RecentSearches } from './RecentSearches'
import { SearchResults } from './SearchResults'

export const SearchOverlayView: React.FC = () => {
  const searchQuery = useRouterQuery(QUERY_PARAMS.SEARCH)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  // prevent body scroll
  useEffect(() => {
    incrementOverlaysOpenCount()

    return () => {
      decrementOverlaysOpenCount()
    }
  }, [incrementOverlaysOpenCount, decrementOverlaysOpenCount])

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
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);
  background-color: ${colors.black};
  padding: 0 var(--global-horizontal-padding);
  overflow: auto;
`
