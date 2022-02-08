import styled from '@emotion/styled'

import { MembershipInfo } from '@/components/MembershipInfo'
import { Tabs } from '@/components/Tabs'
import { cVar, media, oldColors, sizes, transitions } from '@/styles'

export const NotFoundMemberContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const SortContainer = styled.div`
  grid-area: sort;
  grid-gap: 8px;

  ${media.sm} {
    grid-area: initial;
  }
`
export const StyledTabs = styled(Tabs)`
  grid-area: tabs;
  border-bottom: solid 1px ${oldColors.gray[700]};

  ${media.sm} {
    border-bottom: none;
    grid-area: initial;
  }
`

export const TabsContainer = styled.div`
  display: grid;
  padding-top: ${sizes(8)};
  gap: ${sizes(2)};
  grid-template: 'tabs tabs tabs' 1fr 'search search search' auto 'sort sort sort' auto / 1fr 1fr 'filter filter filter' auto / 1fr 1fr;
  align-items: baseline;
  background-color: #000;

  ${media.sm} {
    align-items: center;
    box-shadow: ${cVar('effectDividersBottom')};
    gap: ${sizes(4)};
    grid-template: 1fr / auto 1fr 160px 99px;
  }
`

export const StyledMembershipInfo = styled(MembershipInfo)`
  margin-top: ${sizes(8)};
`

export const FilterButtonContainer = styled.div`
  grid-area: filter;
  grid-gap: 8px;
  ${media.sm} {
    grid-area: initial;
  }
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
