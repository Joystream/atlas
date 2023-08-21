import styled from '@emotion/styled'
import { Editable } from 'slate-react'

import { cVar, sizes } from '@/styles'

import { TextAreaStyles } from '../TextArea/TextArea.styles'

export { CustomBorder, TextAreaContainer as EditorAreaContainer } from '../TextArea/TextArea.styles'

export const EditorWrapper = styled.div`
  display: inline-block;
  width: 100%;
`

export const StyledEditable = styled(Editable)<{ error?: boolean }>`
  ${TextAreaStyles}

  margin-bottom: ${sizes(2)};
  min-height: 128px !important;
`

export const ToolBar = styled.div`
  overflow-x: auto;
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  display: flex;
  padding: ${sizes(2)};
  gap: ${sizes(2)};
`
