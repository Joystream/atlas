import styled from '@emotion/styled'
import React, { useEffect } from 'react'

import { QUERY_PARAMS } from '@/config/routes'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useOverlayManager } from '@/providers/overlayManager'
import { colors, zIndex } from '@/shared/theme'

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
      <SearchResults query={searchQuery || ''} />
    </OverlayContainer>
  )
}

const OverlayContainer = styled.div`
  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: var(--size-topbar-height);
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  height: calc(100vh - var(--size-topbar-height));
  background-color: ${colors.black};
  padding: 0 var(--size-global-horizontal-padding);
  overflow: auto;
`
