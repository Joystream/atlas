import { KeyboardEventHandler, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

import {
  CharacterCount,
  CustomBorder,
  EditorAreaContainer,
  EditorWrapper,
  StyledEditable,
  ToolBar,
} from './MarkdownEditor.styles'
import { deserialize, serialize, setContent, toggleFormat, withShortcuts } from './MarkdownEditor.utils'
import { FormatButton } from './components/FormatButtons'

type SetEditorValue = (nodes: Descendant[], diff?: number) => void

export type MarkdownEditorProps = {
  placeholder?: string
  maxLength?: number
  value?: string
  onChange?: (value: string) => void
}

export const MarkdownEditor = ({ value = '', onChange, placeholder, maxLength: maxLength }: MarkdownEditorProps) => {
  const internalValue = useRef(value)
  const initialValue = useMemo(() => deserialize(internalValue.current), [])
  const [length, setLength] = useState(value.length)

  const [setEditorValue, initSetEditorValue] = useState<SetEditorValue>()

  const handleChange = useCallback(
    (nodes: Descendant[]) => {
      const newValue = serialize(nodes)

      if (maxLength && newValue.length > maxLength) {
        const diff = newValue.length - internalValue.current.length
        return setEditorValue?.(deserialize(internalValue.current), diff)
      }

      internalValue.current = newValue
      setLength(internalValue.current.length)
      onChange?.(internalValue.current)
    },
    [onChange, maxLength, setEditorValue]
  )

  useEffect(() => {
    if (value !== internalValue.current) {
      internalValue.current = value
      setEditorValue?.(deserialize(internalValue.current))
    }
  }, [value, setEditorValue])

  return (
    <EditorWrapper>
      <Editor
        initialValue={initialValue}
        placeholder={placeholder}
        onChange={handleChange}
        initSetEditorValue={initSetEditorValue}
      />
      <CharacterCount>
        {length}
        {!!maxLength && ` / ${maxLength}`}
      </CharacterCount>
    </EditorWrapper>
  )
}

type EditorProps = {
  initialValue: Descendant[]
  placeholder?: string
  onChange: (value: Descendant[]) => void
  initSetEditorValue: (fn: () => SetEditorValue) => void
}
const Editor = memo(({ initialValue, placeholder, initSetEditorValue: setUpdateValue, onChange }: EditorProps) => {
  const editor = useMemo(() => withReact(withShortcuts(withHistory(createEditor()))), [])

  useMountEffect(() => {
    setUpdateValue(() => (nodes, diff) => setContent(editor, nodes, diff))
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
