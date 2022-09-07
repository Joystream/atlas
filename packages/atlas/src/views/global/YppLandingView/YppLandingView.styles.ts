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
  text-align: center;
`

export const HeroGridItem = styled(GridItem)`
  margin: ${sizes(16)} 0;
  align-self: center;
  ${media.md} {
    margin-top: ${sizes(24)} 0;
  }
`

export const CardImageRow = styled(GridItem)`
  display: grid;
  gap: ${sizes(6)};
  ${media.md} {
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
  }
`

export const ImageContainer = styled.div<{
  reverseOrderOnDesktop?: boolean
  positionOnMobile?: 'center' | 'unset' | 'flex-end'
}>`
  position: relative;
  overflow-x: hidden;
  order: ${({ reverseOrderOnDesktop }) => (reverseOrderOnDesktop ? '-1' : 'unset')};
  display: flex;
  justify-content: ${({ positionOnMobile = 'unset' }) => positionOnMobile};
  ${media.sm} {
    justify-content: unset;
  }
`

export const AbsolutelyPositionedImg = styled.img<{ stickToRightSideOnMobile?: boolean }>`
  position: absolute;
  z-index: -1;
  width: 480px;
  ${media.sm} {
    right: unset;
    width: 100%;
    max-width: 640px;
  }
`

export const RelativelyPositionedImg = styled.img<{ stickToRightSideOnMobile?: boolean }>`
  width: 480px;
  ${media.sm} {
    float: unset;
    width: 100%;
    max-width: 640px;
  }
`
