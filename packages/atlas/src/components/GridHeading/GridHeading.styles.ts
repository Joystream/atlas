import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const GridHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
  margin-bottom: ${sizes(12)};
`

export const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
`
