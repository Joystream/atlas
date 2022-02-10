import styled from '@emotion/styled'

import { MembershipInfo } from '@/components/MembershipInfo'
import { Tabs } from '@/components/Tabs'
import { cVar, media, sizes, transitions } from '@/styles'

export const NotFoundMemberContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const SortContainer = styled.div`
  grid-area: sort;
`
export const StyledTabs = styled(Tabs)`
  grid-area: tabs;
  box-shadow: ${cVar('effectDividersBottom')};
  ${media.sm} {
    box-shadow: none;
  }
`

export const TabsContainer = styled.div`
  display: grid;
  padding-top: ${sizes(8)};
  gap: ${sizes(2)};
  grid-template:
    'tabs tabs' auto
    'sort filter' auto / 1fr auto;
  background-color: #000;

  ${media.sm} {
    align-items: center;
    box-shadow: ${cVar('effectDividersBottom')};
    gap: ${sizes(4)};
    grid-template: 'tabs sort filter' 1fr / auto 160px 99px;
  }
`

export const StyledMembershipInfo = styled(MembershipInfo)`
  margin-top: ${sizes(8)};
`

export const FilterButtonContainer = styled.div`
  grid-area: filter;
`

export const TabsWrapper = styled.div<{ isFiltersOpen: boolean }>`
  z-index: 99;
  position: relative;
  margin-bottom: ${sizes(8)};
  ${media.sm} {
    margin-bottom: ${({ isFiltersOpen }) => sizes(isFiltersOpen ? 30 : 12)};
    transition: margin-bottom ${transitions.timings.routing} ${transitions.easing};
  }
`
