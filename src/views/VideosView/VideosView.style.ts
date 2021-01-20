import styled from '@emotion/styled'
import { CategoryPicker, Text } from '@/shared/components'
import { InfiniteVideoGrid } from '@/components'

import { colors, sizes, transitions, zIndex } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'

type IsAtTop = {
  isAtTop: boolean
}

export const GRID_TOP_PADDING = sizes(2, true)
export const Header = styled(Text)`
  margin: 0 0 ${sizes(10)} 0;
`
export const StyledText = styled(Text)`
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
  position: relative;
  padding-top: ${sizes(14)};
`
export const IntersectionTarget = styled.div`
  min-height: 1px;
`
