import { FC, MouseEventHandler, PropsWithChildren } from 'react'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'

import { StyledFormatButton } from '../MarkdownEditor.styles'

type FormatButtonProps = PropsWithChildren<{ action: (editor: Editor) => void }>

export const FormatButton: FC<FormatButtonProps> = ({ action, ...props }) => {
  const editor = useSlate()

  const handleMouseDown: MouseEventHandler = (event) => {
    event.preventDefault()
    action(editor)
  }

  return <StyledFormatButton {...props} onMouseDown={handleMouseDown} />
}
