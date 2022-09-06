import styled from '@emotion/styled'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin-top: ${sizes(16)};
  text-align: center;

  ${media.md} {
    margin-top: ${sizes(24)};
  }
`

export const HeroImageWrapper = styled.div`
  position: relative;
  margin: ${sizes(16)} auto 0 auto;

  ${media.md} {
    max-width: 888px;
  }

  ${media.lg} {
    max-width: 1152px;
  }
`

export const FrontImage = styled.img`
  will-change: transform;
  width: 100%;
  display: block;
`

export const BackImage = styled.img`
  position: absolute;
  width: 100%;
  display: block;
  left: 0;
  top: 0;
`

export const YppProgramContanerGrid = styled(LayoutGrid)`
  margin: ${sizes(16)} 0;
  text-align: center;
  ${media.md} {
    margin: ${sizes(24)} 0;
  }
`

export const HeroGridItem = styled(GridItem)`
  align-self: center;
`
