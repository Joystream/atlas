import styled from '@emotion/styled'

import { Button } from '@/shared/components/Button'
import { Text } from '@/shared/components/Text'
import { SvgGlyphHide } from '@/shared/icons'
import { colors, media, sizes, transitions } from '@/shared/theme'

import { ActionDialog } from '../ActionDialog'

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
  align-items: center;
  margin: 0 var(--size-global-horizontal-padding);
  background-color: ${colors.gray[700]};
  display: ${({ open }) => (open ? 'flex' : 'none')};
  justify-content: space-between;
  padding: ${sizes(4)} var(--size-global-horizontal-padding);
  will-change: opacity, height;
  transition: all ${transitions.timings.routing} ${transitions.easing};
  width: 100%;

  &.filters-enter {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }

  &.filters-enter-active {
    opacity: 1;
    height: 100vh;
    overflow: hidden;

    ${media.sm} {
      height: 72px;
    }
  }

  &.filters-exit {
    opacity: 1;
    height: 100vh;
    overflow: hidden;

    ${media.sm} {
      height: 72px;
    }
  }

  &.filters-exit-active {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }

  ${media.sm} {
    background-color: ${colors.gray[800]};
    margin: 0;
    display: flex;
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

export const ClearAllButton = styled(Button)`
  margin-left: auto;
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
