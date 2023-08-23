import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { cVar, sizes } from '@/styles'

export const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
  margin-top: ${sizes(6)};
`
export const ExpandableContainer = styled.div`
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

export const LabelText = styled(Text)`
  color: ${cVar('colorText')};
`

export const Widget = styled(WidgetTile)`
  position: relative;

  > :first-child {
    margin-bottom: ${sizes(1)};
  }

  > :last-child {
    grid-template-columns: 1fr;
  }
`
