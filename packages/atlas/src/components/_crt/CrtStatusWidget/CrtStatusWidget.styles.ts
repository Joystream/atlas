import styled from '@emotion/styled'

import { WidgetTile } from '@/components/WidgetTile'
import { cVar, sizes, transitions } from '@/styles'

export const Drawer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};

  > :first-child {
    margin-top: ${sizes(6)};
  }

  overflow-y: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
  max-height: ${(props: { maxHeight?: number; isExpanded: boolean }) =>
    props.isExpanded ? `${props.maxHeight}px` : 0};
`
export const ToggleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-top: ${sizes(4)};
  cursor: pointer;

  button {
    grid-row-end: span 2;
  }

  p {
    color: ${cVar('colorText')};
  }
`
export const StatisticsContainer = styled.div`
  ::before {
    content: '';
    display: block;
    position: absolute;
    border-top: solid 1px ${cVar('colorBorderMutedAlpha')};
    left: 0;
    right: 0;
  }
`

export const SupplyLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizes(1)};
`

export const Widget = styled(WidgetTile)`
  position: relative;

  > :last-child {
    grid-template-columns: 1fr;
  }
`
