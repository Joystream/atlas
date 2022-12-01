import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const TabsContainer = styled.div`
  margin-bottom: ${sizes(4)};
  border-bottom: solid 1px ${cVar('colorCoreNeutral800')};
  ${media.md} {
    margin-bottom: ${sizes(6)};
  }
`
