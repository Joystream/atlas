import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { SvgGlyphHide } from '@/shared/icons'
import { colors, media, sizes, transitions } from '@/shared/theme'

export const Container = styled.div`
  margin-top: ${sizes(16)};
`

export const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(4)};
  align-items: center;
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};

  ${media.md} {
    grid-template-columns: auto 160px 1fr 242px;
  }
`

export const SortContainer = styled.div`
  padding-left: ${sizes(4)};
  display: grid;
  grid-gap: 8px;
  align-items: center;
  grid-template-columns: 1fr;
  ${media.xs} {
    grid-template-columns: auto 1fr;
    grid-area: initial;
  }
`

export const FiltersContainer = styled.div<{ open: boolean }>`
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
    stroke: currentColor;
  }
`

export const DateUploadFilterContainer = styled.div`
  padding-bottom: ${sizes(1)};
  display: grid;
  gap: ${sizes(3)};
`

export const MobileFilterContainer = styled.div`
  display: grid;
  padding-bottom: ${sizes(6)};
  gap: ${sizes(3)};
`
