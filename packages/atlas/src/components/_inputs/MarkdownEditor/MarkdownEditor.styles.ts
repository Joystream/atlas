import styled from '@emotion/styled'
import { Editable } from 'slate-react'

import { TextAreaStyles } from '../TextArea/TextArea.styles'
import { InputSize } from '../inputs.utils'

export { CustomBorder, TextAreaContainer as EditorAreaContainer } from '../TextArea/TextArea.styles'

export const StyledEditable = styled(Editable)<{ inputSize: InputSize; error?: boolean }>`
  ${TextAreaStyles}
`
