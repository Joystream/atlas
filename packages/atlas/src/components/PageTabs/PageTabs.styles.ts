import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const PageTabsWrapper = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  padding: 0 ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};
  display: flex;
`

export const BackActionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-right: ${sizes(4)};
  position: relative;
  border-right: 1px solid ${cVar('colorCoreNeutral600')};
  margin-right: ${sizes(4)};
`
export const TailingContentWrapper = styled.div`
  margin: ${sizes(2)} ${sizes(4)} ${sizes(2)} auto;
`
