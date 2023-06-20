import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const PageTabsWrapper = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  padding: 0 ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};
  display: flex;
  justify-content: space-between;
`
export const TailingContentWrapper = styled.div`
  margin: ${sizes(2)} ${sizes(4)};
`
