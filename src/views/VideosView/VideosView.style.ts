import styled from '@emotion/styled'
import { CategoryPicker, Text } from '@/shared/components'
import { InfiniteVideoGrid } from '@/components'

import { colors, sizes, transitions, zIndex, breakpoints } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { SIDENAVBAR_WIDTH } from '@/components/SideNavbar/SideNavbar.style'

type IsAtTop = {
  isAtTop: boolean
}

export const GRID_TOP_PADDING = sizes(2, true)
export const Header = styled(Text)`
  margin: 0 0 ${sizes(10)} 0;
`
export const StyledText = styled(Text)`
  /* Navbar Height padding so the text is not overlapped by Navbar when scrollIntoview */
  padding-top: ${TOP_NAVBAR_HEIGHT}px;
`

export const StyledCategoryPicker = styled(CategoryPicker)<IsAtTop>`
  z-index: ${zIndex.overlay};
  position: sticky;
  /*Offset Category Picker by Navbar Height */
  top: ${TOP_NAVBAR_HEIGHT}px;
  padding: ${sizes(5)} var(--global-horizontal-padding) ${sizes(2)};
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  background-color: ${colors.black};
  border-bottom: 1px solid ${(props) => (props.isAtTop ? colors.black : colors.gray[800])};
  transition: background-color ${transitions.timings.regular} ${transitions.easing};
`
export const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  padding-top: ${GRID_TOP_PADDING}px;
`

export const Container = styled.div`
  position: absolute;
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: 0;
  right: var(--global-horizontal-padding);
  padding-left: var(--global-horizontal-padding);
  padding-top: ${sizes(14)};
  @media screen and (min-width: ${breakpoints.medium}) {
    left: ${SIDENAVBAR_WIDTH}px;
  }
`
export const IntersectionTarget = styled.div`
  min-height: 1px;
`
