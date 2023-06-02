import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { LayoutGrid } from '@/components/LayoutGrid'
import { sizes, zIndex } from '@/styles'

export const StyledLayoutGrid = styled(LayoutGrid)`
  row-gap: ${sizes(8)};
`

export const Wrapper = styled.div<{ actionBarHeight: number }>`
  padding-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
`
export const TextFieldsWrapper = styled.div`
  margin-top: ${sizes(8)};
  display: grid;
  gap: ${sizes(8)};
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`
