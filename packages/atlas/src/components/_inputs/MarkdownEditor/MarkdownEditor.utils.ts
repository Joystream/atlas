import { merge } from 'lodash'
import { Content, Delete, Emphasis, Link, Root, Strong } from 'mdast'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { Descendant, Text } from 'slate'
import { unified } from 'unified'
import flatMap from 'unist-util-flatmap'

export const serialize = (nodes: Descendant[]): string => {
  const slateTree = { type: 'root', children: nodes.map((n) => merge({}, n)) } // deep clone nodes because unist-util-flatmap mutates the tree
  const mdTree = flatMap(slateTree as SlateNode, fromSlateToMd) as unknown as Root
  return unified().use(remarkStringify).stringify(mdTree)
}

export const deserialize = (markdown: string): Descendant[] => {
  const mdTree: Root = unified().use(remarkParse).parse(markdown)
  const slateTree = flatMap(mdTree, fromMdtoSlate) as { children: Descendant[] }
  return slateTree.children
}

type MiscAttrs = { url?: string; title?: string | null; lang?: string | null; meta?: string | null; value?: string }
type SlateNode = { type: (Root | Content)['type']; text?: string; children?: SlateNode[] } & MiscAttrs

const fromMdtoSlate = (node: Root | Content): SlateNode[] => {
  switch (node.type) {
    // Inline literals (https://github.com/syntax-tree/mdast#literal)
    case 'text':
    case 'inlineCode':
    case 'html':
      return [{ type: node.type, text: node.value }]

    // Inline parents (https://github.com/syntax-tree/mdast#parent)
    case 'emphasis':
    case 'strong':
    case 'delete':
      return [{ type: node.type, text: asValue(node) }]

    case 'link':
      return [{ type: node.type, url: node.url, title: node.title, text: asValue(node) }]

    // Block literals (https://github.com/syntax-tree/mdast#literal)
    case 'code': {
      const textNode = { type: 'text', text: node.value } as const
      return [{ type: node.type, lang: node.lang, meta: node.meta, children: [textNode] }]
    }

    // Block parents (https://github.com/syntax-tree/mdast#parent)
    case 'root':
    case 'paragraph':
    case 'heading':
    case 'blockquote':
    case 'list':
    case 'listItem':
      delete node.position
      return node.children?.length > 0 ? [node] : [{ ...node, children: [{ type: 'text', text: '' }] }]

    // Not supported yet
    default:
      return []
  }
}
const asValue = (node: Emphasis | Strong | Delete | Link) => (node.children[0] as unknown as Text).text

type MdNode = { type: Content['type']; children?: MdNode[] } & MiscAttrs
const fromSlateToMd = (node: SlateNode): MdNode[] => {
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
