import { memo, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'

import {
  SvgBlockquote,
  SvgBold,
  SvgHeading,
  SvgItalic,
  SvgOrderedList,
  SvgStrikethrough,
  SvgUnorderedList,
} from '@/assets/icons'
import { useMountEffect } from '@/hooks/useMountEffect'

import { CustomBorder, EditorAreaContainer, StyledEditable, ToolBar } from './MarkdownEditor.styles'
import { deserialize, serialize, toggleFormat, withShortcuts } from './MarkdownEditor.utils'
import { FormatButton } from './components/FormatButtons'

export type MarkdownEditorProps = {
  value?: string
  onChange?: (value: string) => void
}

export const MarkdownEditor = ({ value = '', onChange }: MarkdownEditorProps) => {
  const internalValue = useRef(value)
  const initialValue = useMemo(() => deserialize(internalValue.current), [])

  const [setEditorValue, initSetEditorValue] = useState<(nodes: Descendant[]) => void>()

  const handleChange = useCallback(
    (nodes: Descendant[]) => {
      internalValue.current = serialize(nodes)
      onChange?.(internalValue.current)
    },
    [onChange]
  )

  if (value !== internalValue.current) {
    internalValue.current = value
    setEditorValue?.(deserialize(internalValue.current))
  }

  return <Editor initialValue={initialValue} onChange={handleChange} initSetEditorValue={initSetEditorValue} />
}

type EditorProps = {
  initialValue: Descendant[]
  onChange: (value: Descendant[]) => void
  initSetEditorValue: (fn: () => (nodes: Descendant[]) => void) => void
}
const Editor = memo(({ initialValue, initSetEditorValue: setUpdateValue, onChange }: EditorProps) => {
  const editor = useMemo(() => withReact(withShortcuts(createEditor())), []) // TODO withHistory

  const [, rerender] = useReducer((r) => r + 1, 0)

  useMountEffect(() => {
    setUpdateValue(() => (nodes) => {
      editor.children = nodes
      rerender()
    })
  })

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <ToolBar>
        <FormatButton action={toggleFormat.heading}>
          <SvgHeading />
        </FormatButton>
        <FormatButton action={toggleFormat.strong}>
          <SvgBold />
        </FormatButton>
        <FormatButton action={toggleFormat.emphasis}>
          <SvgItalic />
        </FormatButton>
        <FormatButton action={toggleFormat.delete}>
          <SvgStrikethrough />
        </FormatButton>
        <FormatButton action={toggleFormat.listOrdered}>
          <SvgOrderedList />
        </FormatButton>
        <FormatButton action={toggleFormat.listUnordered}>
          <SvgUnorderedList />
        </FormatButton>
        <FormatButton action={toggleFormat.blockquote}>
          <SvgBlockquote />
        </FormatButton>
      </ToolBar>

      <EditorAreaContainer>
        <StyledEditable inputSize="large" />
        <CustomBorder disabled={false} />
      </EditorAreaContainer>
    </Slate>
  )
})

Editor.displayName = 'Editor'
