import { memo, useCallback, useMemo, useRef } from 'react'
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

  const handleChange = useCallback(
    (nodes: Descendant[]) => {
      internalValue.current = serialize(nodes)
      onChange?.(internalValue.current)
    },
    [onChange]
  )

  if (value !== internalValue.current) {
    internalValue.current = value
  }

  return <Editor initialValue={initialValue} onChange={handleChange} />
}

type EditorProps = {
  initialValue: Descendant[]
  onChange: (value: Descendant[]) => void
}
const Editor = memo(({ initialValue, onChange }: EditorProps) => {
  const editor = useMemo(() => withReact(withShortcuts(createEditor())), []) // TODO withHistory

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
