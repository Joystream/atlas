import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { TextField } from '@/components/_inputs/TextField'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div`
  border-top: 1px solid ${cVar('colorCoreNeutral700')};
`
export const TextFieldsWrapper = styled.div`
  max-width: 640px;
  margin: ${sizes(12)} auto 0;
`

export const StyledTextField = styled(TextField)`
  margin-bottom: ${sizes(5)};
`

export const StyledActionBar = styled(ActionBar)``
