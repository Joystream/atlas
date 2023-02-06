import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const TooltipWrapper = styled.div`
  /* sizes(6) - tooltip horizonthal padding */
  width: calc(232px - ${sizes(6)});
  display: grid;
  grid-gap: ${sizes(3)};
`

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const UpperRow = styled.div`
  display: grid;
  grid-gap: ${sizes(1)};
`
export const TextWithIcon = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(1)};
  align-items: center;
`

export const TooltipFooter = styled.div`
  width: calc(100% + ${sizes(6)});
  padding: ${sizes(3)};
  box-shadow: ${cVar('effectDividersTop')};
  margin: 0 -${sizes(3)} -${sizes(3)};
  background-color: ${cVar('colorBackgroundStrong')};
  display: grid;
  gap: ${sizes(2)};
  grid-template-columns: auto 1fr;
`
