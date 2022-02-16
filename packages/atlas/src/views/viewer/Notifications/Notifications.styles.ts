import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { NotificationTile } from '@/components/NotificationTile'
import { Pill } from '@/components/Pill'
import { media, sizes } from '@/styles'

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
