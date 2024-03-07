import styled from '@emotion/styled'

import { Pagination } from '@/components/Pagination'
import { Select } from '@/components/_inputs/Select'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

export const PaddingWrapper = styled.div<{ filtersOpen: boolean }>`
  position: relative;
  display: flex;
  padding: 0 var(--size-global-horizontal-padding);
  border-bottom: 1px solid ${({ filtersOpen }) => cVar(filtersOpen ? 'colorCoreNeutral800' : 'colorCoreNeutral700')};
  z-index: ${zIndex.nearOverlay};
  background-color: ${cVar('colorCoreNeutral900')};
`

export const SearchControls = styled.div`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  top: var(--size-topbar-height);
  width: 100%;
  background-color: ${cVar('colorCoreNeutral900')};
  z-index: ${zIndex.nearOverlay};
  ${media.md} {
    width: calc(100% - var(--size-sidenav-width-collapsed));
  }
`

export const Results = styled.div<{ filtersOpen: boolean }>`
  padding-top: ${sizes(20)};
  padding-bottom: ${sizes(12)};
  ${media.sm} {
    padding-top: ${({ filtersOpen }) => sizes(filtersOpen ? 36 : 20)};
    transition: padding-top ${transitions.timings.routing} ${transitions.easing};
  }
`

export const FiltersWrapper = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  padding: ${sizes(2)} 0;
`

export const StyledSelect = styled(Select)`
  min-width: 170px;
  margin-right: ${sizes(4)};
`

export const StyledPagination = styled(Pagination)`
  margin-top: ${sizes(12)};
`
