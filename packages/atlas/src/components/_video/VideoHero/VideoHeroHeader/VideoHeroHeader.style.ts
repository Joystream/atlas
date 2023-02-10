import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const StyledVideoHeroHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  align-self: flex-start;
`
export const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: ${cVar('colorCoreNeutral600')};
  margin: 0 ${sizes(2)};

  ${media.md} {
    margin: 0 ${sizes(4)};
  }
`
