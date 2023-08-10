import { memo, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'

import { useMountEffect } from '@/hooks/useMountEffect'

import { CustomBorder, EditorAreaContainer, StyledEditable } from './MarkdownEditor.styles'
import { areNodesEquals, deserialize, renderElement, renderLeaf, serialize } from './MarkdownEditor.utils'

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
      const newNodes = deserialize(internalValue.current)
      // console.log(JSON.stringify(newNodes, null, 2))
      // console.log(areNodesEquals(newNodes, nodes) ? 'same tree' : 'DIFFERENT')
      if (!areNodesEquals(newNodes, nodes)) {
        console.log('DIFFERENT')
        setEditorValue?.(newNodes)
      }
      onChange?.(internalValue.current)
    },
    [onChange, setEditorValue]
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
  const editor = useMemo(() => withReact(createEditor()), []) // TODO withHistory

  const [, rerender] = useReducer((r) => r + 1, 0)

  useMountEffect(() => {
    setUpdateValue(() => (nodes) => {
      editor.children = nodes
      rerender()
    })
  })

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <EditorAreaContainer>
        <StyledEditable inputSize="large" renderElement={renderElement} renderLeaf={renderLeaf} />
        <CustomBorder disabled={false} />
      </EditorAreaContainer>
    </Slate>
  )
})

Editor.displayName = 'Editor'
