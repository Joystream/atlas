import {
  Blockquote,
  Code,
  Content,
  Delete,
  Emphasis,
  HTML,
  Heading,
  InlineCode,
  Link,
  List,
  ListItem,
  Literal,
  Paragraph,
  Parent,
  Root,
  Strong,
  Text,
} from 'mdast'

type UnistNode = { type: string; text?: string }

export type TextNode = LiteralToLeaf<Text>
export type MarkNode = { type: 'mark'; text: string; position: Content['position'] }

type LiteralToLeaf<T extends Literal> = Omit<T, 'value'> & { text: string }
type ParentToLeaf<T extends Parent> = Omit<T, 'children'> & { text: string }
export type LeafNode =
  | TextNode
  | MarkNode
  | LiteralToLeaf<InlineCode>
  | LiteralToLeaf<HTML>
  | ParentToLeaf<Emphasis>
  | ParentToLeaf<Strong>
  | ParentToLeaf<Delete>
  | ParentToLeaf<Link>

type LiteralToElement<T extends Literal> = Omit<T, 'value'> & { children: UnistNode[] }
type ParentToElement<T extends Parent> = Omit<T, 'children'> & { children: UnistNode[] }
export type ElementNode =
  | LiteralToElement<Code>
  | ParentToElement<Root>
  | ParentToElement<Paragraph>
  | ParentToElement<Heading>
  | ParentToElement<ListItem>
  | ParentToElement<List>
  | ParentToElement<Blockquote>

export type EditorNode = ElementNode | LeafNode

type MiscAttrs = { url?: string; title?: string | null; lang?: string | null; meta?: string | null; value?: string }
export type MdNode = { type: Content['type']; children?: MdNode[] } & MiscAttrs
