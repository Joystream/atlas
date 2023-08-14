import { memo, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'

import { useMountEffect } from '@/hooks/useMountEffect'

import { CustomBorder, EditorAreaContainer, StyledEditable } from './MarkdownEditor.styles'
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
      <div>
        <BlockFormatButton format="heading-1">h1</BlockFormatButton>
        <BlockFormatButton format="heading-2">h2</BlockFormatButton>
        <BlockFormatButton format="heading-3">h3</BlockFormatButton>
        <BlockFormatButton format="heading-4">h4</BlockFormatButton>
        <BlockFormatButton format="listOrdered">ol</BlockFormatButton>
        <BlockFormatButton format="listUnordered">ul</BlockFormatButton>
        <InlineFormatButton format="strong">b</InlineFormatButton>
        <InlineFormatButton format="emphasis">i</InlineFormatButton>
        <InlineFormatButton format="delete">s</InlineFormatButton>
        <BlockFormatButton format="blockquote">{'|>'}</BlockFormatButton>
      </div>
      <EditorAreaContainer>
        <StyledEditable inputSize="large" renderElement={renderElement} />
        <CustomBorder disabled={false} />
      </EditorAreaContainer>
    </Slate>
  )
})

Editor.displayName = 'Editor'
