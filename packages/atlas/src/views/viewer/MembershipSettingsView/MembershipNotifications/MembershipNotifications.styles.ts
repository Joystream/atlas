import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { cVar, sizes, zIndex } from '@/styles'

export const Table = styled.table`
  border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')};
  width: 100%;

  thead th {
    text-align: center;
    color: ${cVar('colorText')};
    padding: ${sizes(4)} ${sizes(2)};
    width: 33%;
  }

  tbody {
    th {
      border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
      color: ${cVar('colorTextMuted')};
      padding: ${sizes(8)} ${sizes(2)} ${sizes(2)};
      text-align: start;
      text-transform: uppercase;
    }

    td {
      color: ${cVar('colorTextStrong')};
      padding: ${sizes(2)};
      text-align: center;

      &:first-of-type {
        text-align: start;
      }
    }
  }
`

export const Wrapper = styled.div<{ actionBarHeight: number }>`
  padding-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`
