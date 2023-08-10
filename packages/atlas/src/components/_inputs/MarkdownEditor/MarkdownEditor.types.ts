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

export type BaseNode = { type: string; text?: string; children?: BaseNode[] }

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

type LiteralToElement<T extends Literal> = Omit<T, 'value'> & { children: BaseNode[] }
type ParentToElement<T extends Parent> = Omit<T, 'children'> & { children: BaseNode[] }
export type ElementNode =
  | LiteralToElement<Code>
  | ParentToElement<Root>
  | ParentToElement<Paragraph>
  | ParentToElement<Heading>
  | ParentToElement<ListItem>
  | ParentToElement<List>
  | ParentToElement<Blockquote>

export type EditorNode = ElementNode | LeafNode
