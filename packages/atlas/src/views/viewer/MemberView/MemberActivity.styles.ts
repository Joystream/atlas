import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const GridRowWrapper = styled.div`
  display: contents;
`

export const OverviewItem = styled.div<{ divider?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${sizes(4)};
  padding-bottom: ${sizes(4)};
  margin-bottom: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};

  ${GridRowWrapper} > & {
    box-shadow: none;
  }
`

export const OverviewTextContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: ${sizes(2)};
`

export const OverviewContainer = styled.div`
  margin-top: ${sizes(6)};
  display: grid;
  grid-template-columns: 1fr 1fr;
`
