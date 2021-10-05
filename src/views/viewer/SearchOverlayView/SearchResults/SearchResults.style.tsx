import styled from '@emotion/styled'

import { Button } from '@/shared/components/Button'
import { colors, media, sizes, zIndex } from '@/shared/theme'
import { transitions } from '@/shared/theme'

export const PaddingWrapper = styled.div`
  padding: 0 var(--global-horizontal-padding);
`

export const Filters = styled.div`
  align-items: center;
  background-color: ${colors.gray[700]};
  overflow: hidden;
  will-change: height;
  transition: height ${transitions.timings.routing} ${transitions.easing};
  margin: 0 var(--global-horizontal-padding);
  height: calc(100vh - 145px);

  ${media.sm} {
    background-color: ${colors.gray[800]};
    margin: 0;
    display: flex;
    height: 72px;
  }

  &.filters-active,
  &.filters-exit {
    height: calc(100vh - 145px);

    ${media.sm} {
      height: 72px;
    }
  }

  &.filters-exit-active,
  &.filters-enter {
    height: 0;
  }
`

export const FiltersWrapper = styled.div`
  padding: 0 var(--global-horizontal-padding);
  width: 100%;

  ${media.sm} {
    display: flex;
  }
`

export const SearchControls = styled.div<{ filtersOpen: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: ${colors.gray[900]};
  z-index: ${zIndex.videoWorkspaceOverlay};
  ${({ filtersOpen }) => !filtersOpen && `border-bottom: 1px solid ${colors.gray[700]}`};
`

export const Filter = styled(Button)`
  margin: 0 ${sizes(2)};

  &:first-child {
    margin-left: 0;
  }
`

export const ClearButton = styled(Button)`
  margin-left: auto;
`

export const Results = styled.div`
  padding: 0 var(--global-horizontal-padding);
  padding-top: ${sizes(12)};
`
