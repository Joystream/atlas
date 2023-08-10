import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

export const NoGlobalPaddingWrapper = styled.div`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
  height: 100%;
  overflow: hidden;
`

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: 0 ${sizes(4)};
  height: fit-content;

  ${media.md} {
    margin: 0 ${sizes(8)};
  }
`

export const ScrollWrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
  justify-content: center;
`

export const BottomContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: var(--size-sidenav-width-collapsed);
`
