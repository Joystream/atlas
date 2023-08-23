import { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'

import { Button } from '@/components/_buttons/Button'

type FormatButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { action: (editor: Editor) => void }

export const FormatButton: FC<FormatButtonProps> = ({ action, children, ...props }) => {
  const editor = useSlate()

  const handleMouseDown: MouseEventHandler = (event) => {
    event.preventDefault()
    action(editor)
  }

  return <Button {...props} type="button" variant="tertiary" icon={children} onMouseDown={handleMouseDown} />
}
