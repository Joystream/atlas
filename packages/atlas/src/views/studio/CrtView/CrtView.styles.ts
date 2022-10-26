import styled from '@emotion/styled'

import { Svg404PatternBottomLeft, Svg404PatternTopRight, SvgSmallMoneroModified } from '@/assets/illustrations'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { media, square } from '@/styles'

export const StyledSvgSmallMoneroModified = styled(SvgSmallMoneroModified)`
  ${square('128px')};
  ${media.sm} {
    ${square('unset')};
  }
`

export const ContainerLayoutGrid = styled(LayoutGrid)`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
`

export const StyledGridItem = styled(GridItem)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

export const InnerContainer = styled.div`
  display: grid;
  justify-items: center;
  justify-content: center;
`

export const BottomPattern = styled(Svg404PatternBottomLeft)`
  position: absolute;
  bottom: 0;
  left: 0;
  ${square('216px')};
  ${media.sm} {
    ${square('unset')};
  }
  ${media.xxl} {
    left: 0;
  }
`

export const TopPattern = styled(Svg404PatternTopRight)`
  position: absolute;
  top: 0;
  right: 0;
  width: 270px;
  height: 216px;
  ${media.sm} {
    width: unset;
    height: unset;
  }
  ${media.xxl} {
    right: 0;
  }
`
