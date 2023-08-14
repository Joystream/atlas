import { merge, omit } from 'lodash-es'
import type { Blockquote, Heading, List, ListItem, Paragraph, Root, RootContent, Text } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import type { Descendant, Editor } from 'slate'
import flatMap from 'unist-util-flatmap'

import { BaseNode, EditorNode, ElementNode, LeafNode, MdNode, TextNode } from './MarkdownEditor.types'
import { Element, ElementProps } from './components/Element'

export const withMarkdown = (editor: Editor) => {
  editor.isInline = (node: EditorNode) => !node.isBlock
  return editor
}

export const renderElement = (props: ElementProps) => <Element {...props} />

export const serialize = (nodes: Descendant[]): string => {
  const slateTree = { type: 'root', children: nodes.map((n) => merge({}, n)) } // deep clone nodes because unist-util-flatmap mutates the tree
  console.log(...slateTree.children.map((n) => JSON.stringify(n, null, 2)))
  const mdTree = flatMap(slateTree as EditorNode, fromSlateToMd) as unknown as Root
  return toMarkdown(mdTree, { extensions: [gfmToMarkdown()] })
}

export const deserialize = (markdown: string): Descendant[] => {
  const mdTree: Root = fromMarkdown(markdown, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })
  const slateTree = flatMap(mdTree, toEditorNodes) as { children: Descendant[] }
  return slateTree.children
}

const toEditorNodes = (node: Root | RootContent): EditorNode[] => {
  const editorNode = fromMdToEditorNode(node)
  return editorNode ? [omit(editorNode, 'position') as EditorNode] : []
}

const fromMdToEditorNode = (node: Root | RootContent): EditorNode | undefined => {
  switch (node.type) {
    // Inline literals (https://github.com/syntax-tree/mdast#literal)
    case 'text':
      return asTextNode(node.value)
    case 'inlineCode':
      return { ...omit(node, 'value'), isBlock: false, children: [asTextNode(node.value)] }

    // Inline parents (https://github.com/syntax-tree/mdast#parent)
    case 'emphasis':
    case 'strong':
    case 'delete':
    case 'link': {
      const children = node.children.length ? node.children : asTextNode('')
      return { ...node, isBlock: false, children } as LeafNode
    }

    // Block literals (https://github.com/syntax-tree/mdast#literal)
    case 'code':
      return { ...omit(node, 'value'), isBlock: true, children: [asTextNode(node.value)] }

    // Block parents (https://github.com/syntax-tree/mdast#parent)
    case 'root':
    case 'paragraph':
    case 'heading':
    case 'blockquote':
    case 'list':
    case 'listItem': {
      const children: BaseNode[] = node.children.length ? (node.children as BaseNode[]) : [asTextNode('')]
      return {
        ...node,
        type: asElementType(node),
        isBlock: true,
        isList: node.type === 'list',
        children,
      } as ElementNode
    }

    // Not supported yet
    default:
      return
  }
}

const asTextNode = (text: string): TextNode => ({ type: 'text', children: [{ text }] })

const asElementType = (node: Root | Paragraph | Heading | Blockquote | List | ListItem) => {
  switch (node.type) {
    case 'heading':
      return `heading-${node.depth}` as const

    case 'list':
      return node.ordered ? 'listOrdered' : 'listUnordered'

    default:
      return node.type
  }
}

const fromSlateToMd = (node: EditorNode | { text: string }): MdNode[] => {
  const _node = omit(node, 'isBlock', 'isList') as EditorNode | { text: string }

  if (!('type' in _node)) {
    return [{ type: 'text', value: _node.text }]
  }

  switch (_node.type) {
    case 'text':
      return [..._node.children] as unknown as MdNode[]

    // Inline literals (https://github.com/syntax-tree/mdast#literal)
    case 'inlineCode':
      return ([..._node.children] as unknown as [Text]).map(({ value }) => ({
        ...omit(_node, 'children'),
        value,
      }))

    // Inline parents (https://github.com/syntax-tree/mdast#parent)
    case 'emphasis':
    case 'strong':
    case 'delete':
    case 'link':
      return [_node as MdNode]

    // Block literals (https://github.com/syntax-tree/mdast#literal)
    case 'code':
      return ([..._node.children] as unknown as [Text]).map(({ value }) => ({
        ...omit(_node, 'children'),
        value,
      }))

    // Block parents (https://github.com/syntax-tree/mdast#parent)
    case 'paragraph':
    case 'listItem':
    case 'blockquote':
    case 'root':
      return [_node as MdNode]

    case 'listOrdered':
    case 'listUnordered':
      return [{ _node, type: 'list', ordered: _node.type === 'listOrdered' } as MdNode]
  }

  if (_node.type.startsWith('heading')) {
    const depth = Number(_node.type.slice(8)) as Heading['depth']
    return [{ _node, type: 'heading', depth } as MdNode]
  }

  // Not supported yet
  return []
}
