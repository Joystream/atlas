import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { SvgGlyphHide } from '@/shared/icons'
import { colors, sizes, transitions, zIndex } from '@/shared/theme'

export const FilterContentContainer = styled.div`
  display: grid;
  gap: ${sizes(3)};
`

export const MobileFilterContainer = styled.div`
  display: grid;
  padding-bottom: ${sizes(6)};
  gap: ${sizes(3)};
`

export const FiltersContainer = styled.div<{ open: boolean }>`
  position: absolute;
  z-index: ${zIndex.header};
  width: 100%;
  display: ${({ open }) => (open ? 'flex' : 'none')};
  justify-content: space-between;
  padding: ${sizes(4)};
  background-color: ${colors.gray[900]};
  will-change: opacity;
  transition: opacity ${transitions.timings.sharp} ${transitions.easing};

  &.filters-active,
  &.filters-exit {
    opacity: 1;
  }

  &.filters-exit-active,
  &.filters-enter {
    opacity: 0;
  }
`

export const FiltersInnerContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`

export const OtherFilterStyledText = styled(Text)`
  margin-bottom: ${sizes(2)};
  display: flex;
  align-items: center;
`

export const OtherFilterStyledIcon = styled(SvgGlyphHide)`
  margin-right: ${sizes(2)};

  & path {
    fill: currentColor;
  }
`
