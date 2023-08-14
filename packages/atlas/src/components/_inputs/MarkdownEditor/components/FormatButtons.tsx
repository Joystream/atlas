import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, MouseEventHandler, PropsWithChildren, useCallback } from 'react'
import { Editor, Element, Transforms } from 'slate'
import { useSlate } from 'slate-react'

import { sizes } from '@/styles'

import { EditorNode } from '../MarkdownEditor.types'

type InlineFormatButtonProps = PropsWithChildren<{ format: 'emphasis' | 'strong' | 'delete' | 'inlineCode' }>

export const InlineFormatButton: FC<InlineFormatButtonProps> = (props) => {
  const toggle: ToggleFunction = useCallback(
    (editor, isActive) => {
      const format = props.format
      const selection = editor.selection ?? undefined
      const range = selection && Editor.unhangRange(editor, selection)

      if (isActive === true) {
        Transforms.unwrapNodes(editor, {
          at: range,
          match: (node) => !Editor.isEditor(node) && node.type === format,
          split: true,
        })
      } else if (isActive === false) {
        Transforms.wrapNodes(editor, { type: format, children: [] }, { at: range, split: true })
      }
    },
    [props.format]
  )

  return <FormatButton {...props} toggle={toggle} />
}

type BlockFormatButtonProps = PropsWithChildren<{
  format: 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'listOrdered' | 'listUnordered' | 'blockquote'
}>

export const BlockFormatButton: FC<BlockFormatButtonProps> = (props) => {
  const toggle: ToggleFunction = useCallback(
    (editor, isActive) => {
      const format = props.format

      Transforms.unwrapNodes(editor, {
        match: (node) => !Editor.isEditor(node) && node.isList,
        split: true,
      })

      if (isActive) {
        return Transforms.setNodes(
          editor,
          { type: 'paragraph', isBlock: true },
          { match: (node) => !Editor.isEditor(node) && node.isBlock }
        )
      }

      const isList = ['listOrdered', 'listUnordered'].includes(format)

      Transforms.setNodes<Element>(
        editor,
        { type: isList ? 'listItem' : format, isBlock: true },
        { match: (node) => !Editor.isEditor(node) && node.isBlock }
      )

      if (isList) {
        Transforms.wrapNodes(
          editor,
          { type: format, isBlock: true, isList: true, children: [] },
          { match: (node) => !Editor.isEditor(node) && node.type === 'listItem' }
        )
      }
    },
    [props.format]
  )

  return <FormatButton {...props} toggle={toggle} />
}

type ToggleFunction = (editor: Editor, isActive: boolean | null) => void
type FormatButtonProps = PropsWithChildren<{ format: EditorNode['type']; toggle: ToggleFunction }>
const FormatButton: FC<FormatButtonProps> = ({ format, toggle, children }) => {
  const editor = useSlate()

  const { selection } = editor

  const isActive =
    selection &&
    Array.isArray(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (node) => !Editor.isEditor(node) && node.type === format,
      }).next().value
    )

  const handleMouseDown: MouseEventHandler = (event) => {
    event.preventDefault()
    toggle(editor, isActive)
  }

  return (
    <StyledFormatButton isActive={isActive ?? false} onMouseDown={handleMouseDown}>
      {children}
    </StyledFormatButton>
  )
}

const StyledFormatButton = styled.button<{ isActive: boolean }>`
  background: #ccc;
  display: inline-block;
  height: ${sizes(8)};
  width: ${sizes(8)};
  ${({ isActive }) =>
    isActive &&
    css`
      background: #fff;
    `}
`
