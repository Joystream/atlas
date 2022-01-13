import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { TextField } from '@/components/_inputs/TextField'
import { cVar, sizes, zIndex } from '@/styles'

export const Wrapper = styled.div<{ actionBarHeight: number }>`
  border-top: 1px solid ${cVar('colorCoreNeutral700')};
  padding-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
`
export const TextFieldsWrapper = styled.div`
  max-width: 640px;
  margin: ${sizes(12)} auto 0;
`

export const StyledTextField = styled(TextField)`
  margin-bottom: ${sizes(5)};
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`
