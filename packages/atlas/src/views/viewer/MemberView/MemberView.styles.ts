import styled from '@emotion/styled'

import { MembershipInfo } from '@/components/MembershipInfo'
import { Tabs } from '@/components/Tabs'
import { media, oldColors, sizes } from '@/styles'

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
  margin-bottom: ${sizes(8)};
  gap: ${sizes(2)};
  grid-template: 'tabs tabs tabs' 1fr 'search search search' auto 'sort sort sort' auto / 1fr 1fr;
  align-items: baseline;

  ${media.xs} {
    padding-top: ${sizes(8)};
  }

  ${media.sm} {
    align-items: center;
    border-bottom: solid 1px ${oldColors.gray[700]};
    gap: ${sizes(8)};
    grid-template: 1fr / 1fr 193.333px;
  }
`

export const StyledMembershipInfo = styled(MembershipInfo)`
  margin-top: ${sizes(8)};
`
