import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { MembershipInfo } from '@/components/MembershipInfo'
import { Pagination } from '@/components/Pagination'
import { Tabs } from '@/components/Tabs'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

export const NotFoundMemberContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const SortContainer = styled.div`
  grid-area: sort;
  margin-bottom: ${sizes(8)};
  ${media.sm} {
    margin-bottom: unset;
  }
`
export const StyledTabs = styled(Tabs)`
  grid-area: tabs;
  box-shadow: ${cVar('effectDividersBottom')};
  ${media.sm} {
    box-shadow: none;
  }
`

export const TabsContainer = styled.div<{ isMemberActivityTab: boolean }>`
  display: grid;
  padding-top: ${sizes(8)};
  gap: ${sizes(8)} ${sizes(2)};
  background-color: #000;

  ${({ isMemberActivityTab }) =>
    isMemberActivityTab
      ? css`
          grid-template:
            'tabs tabs' auto
            'sort sort' auto / 1fr auto;
        `
      : css`
          grid-template:
            'tabs tabs' auto
            'sort filter' auto / 1fr auto;
        `};

  ${media.sm} {
    align-items: center;
    box-shadow: ${cVar('effectDividersBottom')};
    gap: ${sizes(4)};

    ${({ isMemberActivityTab }) =>
      isMemberActivityTab
        ? css`
            grid-template: 'tabs sort' 1fr / auto 180px;
          `
        : css`
            grid-template: 'tabs sort filter' 1fr / auto 180px 99px;
          `};
  }
`

export const StyledMembershipInfo = styled(MembershipInfo)`
  margin-top: ${sizes(8)};
`

export const FilterButtonContainer = styled.div`
  grid-area: filter;
`

export const TabsWrapper = styled.div<{ isFiltersOpen: boolean }>`
  z-index: ${zIndex.transactionBar};
  position: relative;
  ${media.sm} {
    margin-bottom: ${({ isFiltersOpen }) => sizes(isFiltersOpen ? 30 : 8)};
    transition: margin-bottom ${transitions.timings.routing} ${transitions.easing};
  }
`

export const StyledPagination = styled(Pagination)`
  padding-top: ${sizes(12)};
`
