import styled from '@emotion/styled'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { LottiePlayer } from '@/components/LottiePlayer'
import { media, sizes, zIndex } from '@/styles'

export const StyledLimitedContainer = styled(LimitedWidthContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
`
export const StyledLayoutGrid = styled(LayoutGrid)`
  padding: 0 ${sizes(4)};
  padding-top: 54px;
  ${media.sm} {
    padding-top: 0;
  }
`

export const StyledGridItem = styled(GridItem)`
  display: flex;
  align-items: center;
`

export const StyledLottie = styled(LottiePlayer)`
  height: 100vh;
  width: 100vh;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: ${zIndex.globalOverlay};
  position: absolute;
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${sizes(10)};
`
