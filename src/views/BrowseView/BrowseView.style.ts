import styled from '@emotion/styled'
import { CategoryPicker, InfiniteVideoGrid, Text } from '@/shared/components'

import { ReactComponent as BackgroundPattern } from '@/assets/bg-pattern.svg'
import { colors, sizes, zIndex } from '@/shared/theme'
import { NAVBAR_HEIGHT } from '@/components/Navbar'

type IsAtTop = {
  isAtTop: boolean
}

export const GRID_TOP_PADDING = sizes(2, true)
export const Header = styled(Text)`
  margin: 0 0 ${sizes(10)} 0;
`
export const StyledCategoryPicker = styled(CategoryPicker)<IsAtTop>`
  z-index: ${zIndex.overlay};
  position: sticky;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  /*Offset Category Picker by Navbar Height */
  top: ${NAVBAR_HEIGHT}px;
  padding: ${sizes(5)} 0 ${sizes(5)};
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  background-color: ${colors.black};
  border-bottom: 1px solid ${(props) => (props.isAtTop ? colors.black : colors.gray[800])};
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
export const StyledBackgroundPattern = styled(BackgroundPattern)`
  position: absolute;
  right: 0;
  z-index: ${zIndex.background};
`
