import { KeyboardEventHandler, memo, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { Descendant, createEditor } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'

import {
  SvgActionLinkUrl,
  SvgActionSeparator,
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
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export const MarkdownEditor = ({ value = '', onChange, placeholder }: MarkdownEditorProps) => {
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

  return (
    <Editor
      initialValue={initialValue}
      placeholder={placeholder}
      onChange={handleChange}
      initSetEditorValue={initSetEditorValue}
    />
  )
}

type EditorProps = {
  initialValue: Descendant[]
  placeholder?: string
  onChange: (value: Descendant[]) => void
  initSetEditorValue: (fn: () => (nodes: Descendant[]) => void) => void
}
const Editor = memo(({ initialValue, placeholder, initSetEditorValue: setUpdateValue, onChange }: EditorProps) => {
  const editor = useMemo(() => withReact(withShortcuts(withHistory(createEditor()))), [])

  const [, rerender] = useReducer((r) => r + 1, 0)

  useMountEffect(() => {
    setUpdateValue(() => (nodes) => {
      editor.children = nodes
      rerender()
    })
  })

  const handleKeyDown: KeyboardEventHandler = useCallback(
    (event) => {
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key) {
          case 'z':
            return HistoryEditor.redo(editor)
        }
      }
    },
    [editor]
  )

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <ToolBar>
        <FormatButton title="Heading" action={toggleFormat.heading}>
          <SvgHeading />
        </FormatButton>

        <FormatButton title="Bold" action={toggleFormat.strong}>
          <SvgBold />
        </FormatButton>

        <FormatButton title="Italic" action={toggleFormat.emphasis}>
          <SvgItalic />
        </FormatButton>

        <FormatButton title="Striked" action={toggleFormat.delete}>
          <SvgStrikethrough />
        </FormatButton>

        <FormatButton title="Link" action={toggleFormat.link}>
          <SvgActionLinkUrl />
        </FormatButton>

        <FormatButton title="Numbered list" action={toggleFormat.listOrdered}>
          <SvgOrderedList />
        </FormatButton>

        <FormatButton title="Bullet list" action={toggleFormat.listUnordered}>
          <SvgUnorderedList />
        </FormatButton>

        <FormatButton title="Quote" action={toggleFormat.blockquote}>
          <SvgBlockquote />
        </FormatButton>

        <FormatButton title="Separator" action={toggleFormat.thematicBreak}>
          <SvgActionSeparator />
        </FormatButton>
      </ToolBar>

      <EditorAreaContainer>
        <StyledEditable placeholder={placeholder} onKeyDown={handleKeyDown} />
        <CustomBorder disabled={false} />
      </EditorAreaContainer>
    </Slate>
  )
})

Editor.displayName = 'Editor'
