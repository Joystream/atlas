import styled from '@emotion/styled'
import { Editable } from 'slate-react'

import { cVar, sizes } from '@/styles'

import { TextAreaStyles } from '../TextArea/TextArea.styles'
import { InputSize } from '../inputs.utils'

export { CustomBorder, TextAreaContainer as EditorAreaContainer } from '../TextArea/TextArea.styles'

export const StyledEditable = styled(Editable)<{ inputSize: InputSize; error?: boolean }>`
  ${TextAreaStyles}
`

export const ToolBar = styled.div`
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  display: flex;
  padding: ${sizes(2)};
  gap: ${sizes(2)};
`
