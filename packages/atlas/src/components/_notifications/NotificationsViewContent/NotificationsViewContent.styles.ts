import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NotificationTile } from '@/components/_notifications/NotificationTile'
import { cVar, media, sizes } from '@/styles'

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

export const KebabButton = styled(Button)`
  margin-top: 0;
  margin-left: auto;
`

export const StyledNotificationTile = styled(NotificationTile)`
  background-color: ${cVar('colorBackgroundMuted')};
  box-shadow: none;

  :not(:last-of-type) {
    margin-bottom: ${sizes(2)};
  }
`

const TILE_HEIGHT = 78

export const StyledNotificationLoader = styled(SkeletonLoader)`
  height: ${TILE_HEIGHT}px;
  width: 100%;

  :first-of-type {
    margin-top: ${sizes(2)};
  }

  :not(:last-of-type) {
    margin-bottom: ${sizes(2)};
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${sizes(1)};

  ${media.sm} {
    align-items: center;
    flex-direction: row;
    gap: ${sizes(4)};
  }
`

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
