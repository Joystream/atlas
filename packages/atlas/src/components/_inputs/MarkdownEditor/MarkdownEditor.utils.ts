import { Descendant, Node } from 'slate'

export const serialize = (nodes: Descendant[]): string => nodes.map((node) => Node.string(node)).join('\n')

export const deserialize = (markdown: string): Descendant[] =>
  markdown.split('\n').map((text) => ({ type: 'paragraph', children: [{ text }] }))
