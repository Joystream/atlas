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
import { deserialize, renderElement, serialize, withMarkdown } from './MarkdownEditor.utils'
import { BlockFormatButton, InlineFormatButton } from './components/FormatButtons'

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
  const editor = useMemo(() => withMarkdown(withReact(createEditor())), []) // TODO withHistory

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
        <BlockFormatButton format="heading-3">
          <SvgHeading />
        </BlockFormatButton>
        <InlineFormatButton format="strong">
          <SvgBold />
        </InlineFormatButton>
        <InlineFormatButton format="emphasis">
          <SvgItalic />
        </InlineFormatButton>
        <InlineFormatButton format="delete">
          <SvgStrikethrough />
        </InlineFormatButton>
        <BlockFormatButton format="listOrdered">
          <SvgOrderedList />
        </BlockFormatButton>
        <BlockFormatButton format="listUnordered">
          <SvgUnorderedList />
        </BlockFormatButton>
        <BlockFormatButton format="blockquote">
          <SvgBlockquote />
        </BlockFormatButton>
      </ToolBar>
      <EditorAreaContainer>
        <StyledEditable inputSize="large" renderElement={renderElement} />
        <CustomBorder disabled={false} />
      </EditorAreaContainer>
    </Slate>
  )
})

Editor.displayName = 'Editor'
