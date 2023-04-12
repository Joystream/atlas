import styled from '@emotion/styled'

import { SvgSmallTokens } from '@/assets/illustrations'
import { cVar, media, sizes, square } from '@/styles'

export const TabsContainer = styled.div`
  margin-bottom: ${sizes(4)};
  border-bottom: solid 1px ${cVar('colorCoreNeutral800')};
  ${media.md} {
    margin-bottom: ${sizes(6)};
  }
`
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
`

export const StyledSvgSmallTokens = styled(SvgSmallTokens)`
  ${square('128px')};

  ${media.sm} {
    ${square('unset')};
  }
`

export const TextContainer = styled.div`
  text-align: center;

  ${media.sm} {
    width: 610px;
  }

  ${media.md} {
    margin-bottom: ${sizes(6)};
  }
`
