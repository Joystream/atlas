import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { zIndex } from '@/styles'

export const Wrapper = styled.div<{ actionBarHeight: number }>`
  padding-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`
