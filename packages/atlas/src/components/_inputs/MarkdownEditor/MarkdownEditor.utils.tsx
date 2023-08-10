import { last, merge, omit } from 'lodash-es'
import { Content, Delete, Emphasis, Link, Root, Strong } from 'mdast'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { Descendant, Text } from 'slate'
import { unified } from 'unified'
import flatMap from 'unist-util-flatmap'

import { EditorNode, LeafNode, MarkNode, MdNode, TextNode } from './MarkdownEditor.types'
import { Element, ElementProps } from './components/Element'
import { Leaf, LeafProps } from './components/Leaf'

export const renderElement = (props: ElementProps) => <Element {...props} />

export const renderLeaf = (props: LeafProps) => <Leaf {...props} />

export const serialize = (nodes: Descendant[]): string => {
  const slateTree = { type: 'root', children: nodes.map((n) => merge({}, n)) } // deep clone nodes because unist-util-flatmap mutates the tree
  const mdTree = flatMap(slateTree as EditorNode, fromSlateToMd) as unknown as Root
  return unified().use(remarkStringify).stringify(mdTree)
}

export const deserialize = (markdown: string): Descendant[] => {
  const mdTree: Root = unified().use(remarkParse).parse(markdown)
  const slateTree = flatMap(mdTree, fromMdWithMarks(markdown)) as { children: Descendant[] }
  return slateTree.children
}

const fromMdWithMarks =
  (markdown: string) =>
  (node: Root | Content): EditorNode[] => {
    const editorNode = fromMdToEditorNode(node)

    if (!editorNode) return []
    if (node.type === 'text') {
      return [editorNode]
    }

    const initialString = markdown.slice(node.position?.start.offset, node.position?.end.offset)

    if ('value' in node) {
      const contentStart = initialString.indexOf(node.value)
      return wrapInMarks(editorNode, initialString, contentStart, contentStart + node.value.length)
    }
    if ('children' in node && node.children.length) {
      const nodeStart = node.position?.start.offset ?? 0
      const contentStart = (node.children?.[0].position?.start.offset ?? 0) - nodeStart
      const contentEnd = (last(node.children)?.position?.end.offset ?? 0) - nodeStart
      return wrapInMarks(editorNode, initialString, contentStart, contentEnd)
    }

    return [editorNode]
  }

const wrapInMarks = (
  editorNode: EditorNode,
  initialString: string,
  contentStart: number,
  contentEnd: number
): EditorNode[] => {
  const startMarkText = initialString.slice(0, contentStart)
  const endMarkText = initialString.slice(contentEnd)
  const startMark: MarkNode[] = !startMarkText
    ? []
    : [
        {
          type: 'mark',
          text: startMarkText,
          position: merge({}, editorNode.position, {
            end: {
              column: editorNode.position?.start.column ?? 0 + startMarkText.length,
              offset: editorNode.position?.start.offset ?? 0 + startMarkText.length,
            },
          }),
        },
      ]
  const endMark: MarkNode[] = !endMarkText
    ? []
    : [
        {
          type: 'mark',
          text: endMarkText,
          position: merge({}, editorNode.position, {
            start: {
              column: editorNode.position?.end.column ?? 0 - endMarkText.length,
              offset: editorNode.position?.end.offset ?? 0 - endMarkText.length,
            },
          }),
        },
      ]

  if ('children' in editorNode) {
    const children = [...startMark, ...editorNode.children, ...endMark]
    return [{ ...editorNode, children }]
  }

  return [...startMark, editorNode, ...endMark]
}

const fromMdToEditorNode = (node: Root | Content): EditorNode | undefined => {
  switch (node.type) {
    // Inline literals (https://github.com/syntax-tree/mdast#literal)
    case 'text':
    case 'inlineCode':
    case 'html':
      return { ...omit(node, 'value'), text: node.value }

    // Inline parents (https://github.com/syntax-tree/mdast#parent)
    case 'emphasis':
    case 'strong':
    case 'delete':
    case 'link':
      return { ...omit(node, 'children'), text: asValue(node) } as LeafNode

    // Block literals (https://github.com/syntax-tree/mdast#literal)
    case 'code':
      return { ...omit(node, 'value'), children: [fromMdToEditorNode({ ...node, type: 'text' }) as TextNode] }

    // Block parents (https://github.com/syntax-tree/mdast#parent)
    case 'root':
    case 'paragraph':
    case 'heading':
    case 'blockquote':
    case 'list':
    case 'listItem':
      return node.children?.length > 0 ? node : { ...node, children: [{ type: 'text', text: '' }] }

    // Not supported yet
    default:
      return
  }
}
const asValue = (node: Emphasis | Strong | Delete | Link) => (node.children[0] as unknown as Text).text

const fromSlateToMd = (node: EditorNode): MdNode[] => {
  switch (node.type) {
    // Inline literals (https://github.com/syntax-tree/mdast#literal)
    case 'text':
    case 'inlineCode':
    case 'html':
      return [{ type: node.type, value: node.text }]

    // Inline parents (https://github.com/syntax-tree/mdast#parent)
    case 'emphasis':
    case 'strong':
    case 'delete':
      return [{ type: node.type, children: [{ type: 'text', value: node.text }] }]

    case 'link':
      return [{ type: node.type, url: node.url, title: node.title, children: [{ type: 'text', value: node.text }] }]

    // Block literals (https://github.com/syntax-tree/mdast#literal)
    case 'code': {
      const value = (node.children?.[0] as unknown as { value: string }).value
      return [{ type: node.type, lang: node.lang, meta: node.meta, value }]
    }

    // Block parents (https://github.com/syntax-tree/mdast#parent)
    case 'root':
    case 'paragraph':
    case 'heading':
    case 'blockquote':
    case 'list':
    case 'listItem':
      return [node as MdNode]

    // Not supported yet
    default:
      return []
  }
}
