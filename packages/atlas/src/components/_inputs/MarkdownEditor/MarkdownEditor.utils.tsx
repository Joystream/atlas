import { last, merge, omit } from 'lodash-es'
import { Content, Delete, Emphasis, Link, Root, Strong } from 'mdast'
import remarkParse from 'remark-parse'
import { Descendant, Node, Text } from 'slate'
import { unified } from 'unified'
import flatMap from 'unist-util-flatmap'

import { BaseNode, EditorNode, LeafNode, MarkNode, TextNode } from './MarkdownEditor.types'
import { Element, ElementProps } from './components/Element'
import { Leaf, LeafProps } from './components/Leaf'

export const areNodesEquals = (mdNodes: BaseNode[] | undefined, slateNodes: BaseNode[] | undefined) => {
  if (!mdNodes || !slateNodes) return false

  const nonMarkMd = mdNodes.filter((node) => node.type !== 'mark')
  const nonMarkSlate = slateNodes.filter(
    // Filter empty paragraph on the editor obj as they are ignored by remark
    (node) =>
      node.type !== 'mark' && !(node.type === 'paragraph' && node.children?.every((node) => node.text?.trim() === ''))
  )

  if (nonMarkMd.length !== nonMarkSlate.length) return false

  return nonMarkMd.every((mdNode, index): boolean => {
    const slateNode = nonMarkSlate[index]
    if (mdNode.type !== slateNode.type) return false
    if ('text' in mdNode) return mdNode.text === slateNode.text?.trim()
    if (!mdNode.children || !slateNode.children) return false
    return areNodesEquals(mdNode.children, slateNode.children)
  })
}

export const renderElement = (props: ElementProps) => <Element {...props} />

export const renderLeaf = (props: LeafProps) => <Leaf {...props} />

export const serialize = (nodes: Descendant[]): string => nodes.map((node) => Node.string(node)).join('\n\n')

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
