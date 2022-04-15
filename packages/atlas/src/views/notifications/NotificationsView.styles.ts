import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { Pill } from '@/components/Pill'
import { NotificationTile } from '@/components/_notifications/NotificationTile'
import { cVar, media, sizes, zIndex } from '@/styles'

export const StyledLayoutGrid = styled(LayoutGrid)`
  padding-top: ${sizes(12)};
`

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: ${sizes(6)};

  ${media.sm} {
    margin-bottom: ${sizes(12)};
  }
`

export const StyledPill = styled(Pill)`
  margin-left: ${sizes(4)};
`

export const MarkAllReadWrapper = styled.div`
  flex-basis: 100%;
  margin-top: ${sizes(6)};

  ${media.sm} {
    flex-basis: unset;
    margin-top: 0;
    margin-left: auto;
  }
`

export const StyledNotificationTile = styled(NotificationTile)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(2)};
  }
`

const TILE_HEIGHT = 78

export const NotificationEmptyRectangle = styled.div<{ opacity?: number; absolute?: boolean }>`
  position: ${({ absolute }) => (absolute ? 'absolute' : 'static')};
  z-index: -1;
  top: 0;
  width: 100%;
  background-color: ${cVar('colorBackgroundMuted')};
  height: ${TILE_HEIGHT}px;
  opacity: ${({ opacity = 1 }) => opacity};
  margin-bottom: ${sizes(2)};
`

export const NotificationEmptyRectangleWithText = styled.div`
  display: flex;
  text-align: center;
  height: ${TILE_HEIGHT}px;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: ${sizes(2)};
`

export const FloatingActionBar = styled.div<{ 'data-bottom-nav-open'?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: ${cVar('colorBackgroundStrong')};
  z-index: ${zIndex.overlay};
  padding: ${sizes(2)};
  width: 303px;
  position: fixed;
  top: calc(100vh - ${sizes(8)});
  left: 50%;
  transform: translate(-50%, -100%);
  transition: all ${cVar('animationTransitionSlow')};

  &[data-bottom-nav-open='true'] {
    top: calc(100vh - ${sizes(24)});
  }

  ${media.sm} {
    justify-content: unset;
    width: unset;
    display: grid;
    grid-auto-columns: max-content;
    grid-auto-flow: column;
    padding: ${sizes(4)} ${sizes(8)};

    button:not(:last-child) {
      margin-right: ${sizes(4)};
    }
  }
`
