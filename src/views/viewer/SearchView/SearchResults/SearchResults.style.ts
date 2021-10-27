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
  will-change: height;
  margin: 0 var(--size-global-horizontal-padding);
  height: 100vh;
  width: 100%;
  padding: 0 var(--size-global-horizontal-padding);
  transition: height ${transitions.timings.routing} ${transitions.easing};

  ${media.sm} {
    background-color: ${colors.gray[800]};
    margin: 0;
    display: flex;
    height: 72px;
  }

  &.filters-enter {
    height: 0;
    overflow: hidden;
  }

  &.filters-enter-active {
    height: 100vh;
    overflow: hidden;

    ${media.sm} {
      height: 72px;
    }
  }

  &.filters-exit {
    height: 100vh;
    overflow: hidden;

    ${media.sm} {
      height: 72px;
    }
  }

  &.filters-exit-active {
    height: 0;
    overflow: hidden;
  }
`

export const SearchControls = styled.div<{ filtersOpen: boolean }>`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  top: var(--size-topbar-height);
  width: 100%;
  background-color: ${colors.gray[900]};
  z-index: ${zIndex.videoWorkspaceOverlay};
  transition: border-bottom 0ms linear 300ms;
  border-bottom: ${({ filtersOpen }) =>
    filtersOpen ? `0 solid ${colors.gray[700]}` : `1px solid ${colors.gray[700]}`};

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
