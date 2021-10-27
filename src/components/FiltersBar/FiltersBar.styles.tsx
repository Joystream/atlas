import styled from '@emotion/styled'

import { Button } from '@/shared/components/Button'
import { Text } from '@/shared/components/Text'
import { SvgGlyphHide } from '@/shared/icons'
import { colors, sizes, transitions } from '@/shared/theme'

import { ActionDialog } from '../ActionDialog'

type Variant = 'default' | 'secondary'

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
  display: ${({ open }) => (open ? 'flex' : 'none')};
  justify-content: space-between;
  padding: ${sizes(4)} 0;
  will-change: opacity;
  transition: opacity ${transitions.timings.routing} ${transitions.easing} 100ms;
  width: 100%;

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

export const ClearAllButton = styled(Button)<{ filtersVariant: Variant }>`
  margin-left: ${({ filtersVariant }) => (filtersVariant === 'secondary' ? 'auto' : 'unset')};
`

export const StyledActionDialog = styled(ActionDialog)`
  background-color: ${colors.gray[700]};
`

export const ActionDialogHeader = styled.div`
  border-bottom: 1px solid ${colors.gray[600]};
  margin-bottom: ${sizes(4)};
  padding-top: ${sizes(2)};
  padding-bottom: ${sizes(6)};
`

export const StyledTitleText = styled(Text)`
  width: 90%;
  word-wrap: break-word;
`
