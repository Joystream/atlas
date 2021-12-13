import styled from '@emotion/styled'

import { Select } from '@/components/_inputs/Select'
import { media, oldColors, sizes, zIndex } from '@/styles'
import { transitions } from '@/styles'

export const PaddingWrapper = styled.div<{ filtersOpen: boolean }>`
  position: relative;
  display: flex;
  padding: 0 var(--size-global-horizontal-padding);
  border-bottom: 1px solid ${({ filtersOpen }) => oldColors.gray[filtersOpen ? 800 : 700]};
  z-index: ${zIndex.nearOverlay};
  background-color: ${oldColors.gray[900]};
`

export const SearchControls = styled.div`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  top: var(--size-topbar-height);
  width: 100%;
  background-color: ${oldColors.gray[900]};
  z-index: ${zIndex.nearOverlay};
  ${media.md} {
    width: calc(100% - var(--size-sidenav-width-collapsed));
  }
`

export const Results = styled.div<{ filtersOpen: boolean }>`
  padding-top: ${sizes(30)};
  padding-bottom: ${sizes(12)};
  ${media.sm} {
    padding-top: ${({ filtersOpen }) => sizes(filtersOpen ? 48 : 30)};
    transition: padding-top ${transitions.timings.routing} ${transitions.easing};
  }
`

export const FiltersWrapper = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`

export const StyledSelect = styled(Select)`
  min-width: 170px;
  margin-right: ${sizes(4)};
`
