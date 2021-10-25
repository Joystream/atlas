import styled from '@emotion/styled'

import { Button } from '@/shared/components/Button'
import { colors, media, sizes, zIndex } from '@/shared/theme'
import { transitions } from '@/shared/theme'

export const PaddingWrapper = styled.div`
  padding: 0 var(--size-global-horizontal-padding);
`

export const Filters = styled.div`
  align-items: center;
  background-color: ${colors.gray[700]};
  overflow: hidden;
  will-change: height;
  transition: height ${transitions.timings.routing} ${transitions.easing};
  margin: 0 var(--size-global-horizontal-padding);
  height: calc(100vh - 145px);
  width: 100%;
  padding: 0 var(--size-global-horizontal-padding);

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

export const SearchControls = styled.div<{ filtersOpen: boolean }>`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  top: var(--size-topbar-height);
  width: 100%;
  background-color: ${colors.gray[900]};
  z-index: ${zIndex.videoWorkspaceOverlay};
  ${({ filtersOpen }) => !filtersOpen && `border-bottom: 1px solid ${colors.gray[700]}`};

  ${media.md} {
    width: calc(100% - var(--size-sidenav-width-collapsed));
  }
`

export const Results = styled.div<{ filtersOpen: boolean }>`
  padding-top: ${sizes(30)};
  padding-bottom: ${sizes(12)};

  ${media.sm} {
    padding-top: ${({ filtersOpen }) => sizes(filtersOpen ? 48 : 30)};
    transition: padding-top ${transitions.timings.routing} ${transitions.easing};
  }
`

export const StartNewSearch = styled(Button)`
  margin-top: ${sizes(6)};
  align-self: center;
`
