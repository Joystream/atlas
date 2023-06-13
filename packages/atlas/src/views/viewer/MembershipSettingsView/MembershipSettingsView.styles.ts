import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { media, sizes, zIndex } from '@/styles'

export const NoGlobalPaddingWrapper = styled.div`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
`

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: ${sizes(4)} auto;
  ${media.md} {
    margin: ${sizes(8)} auto;
  }
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`

export const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`
