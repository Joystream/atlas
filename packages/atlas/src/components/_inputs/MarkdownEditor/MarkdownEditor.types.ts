import type {
  Blockquote,
  Code,
  Delete,
  Emphasis,
  Heading,
  InlineCode,
  Link,
  ListItem,
  Literal,
  Paragraph,
  Parent,
  Root,
  RootContent,
  Strong,
} from 'mdast'

export type TextNode = { text: string }
export type BaseNode = { type: string; children: BaseNode[] } | TextNode

type LiteralToLeaf<T extends Literal> = Omit<T, 'value'> & { isBlock?: false; children: BaseNode[] }
type ParentToLeaf<T extends Parent> = Omit<T, 'children'> & { isBlock?: false; children: BaseNode[] }
export type InlineNode =
  | LiteralToLeaf<InlineCode>
  | ParentToLeaf<Emphasis>
  | ParentToLeaf<Strong>
  | ParentToLeaf<Delete>
  | ParentToLeaf<Link>

type LiteralToElement<T extends Literal> = Omit<T, 'value'> & { isBlock: true; isList?: false; children: BaseNode[] }
type ParentToElement<T extends Parent> = Omit<T, 'children'> & { isBlock: true; isList?: false; children: BaseNode[] }
export type BlockNode =
  | LiteralToElement<Code>
  | ParentToElement<Root>
  | ParentToElement<Paragraph>
  | { type: `heading-${Heading['depth']}`; isBlock: true; isList?: false; children: BaseNode[] }
  | { type: 'listOrdered' | 'listUnordered'; isBlock: true; isList: true; children: BaseNode[] }
  | ParentToElement<ListItem>
  | ParentToElement<Blockquote>

export type EditorNode = BlockNode | InlineNode

type MiscAttrs = { url?: string; title?: string | null; lang?: string | null; meta?: string | null; value?: string }
export type MdNode = { type: RootContent['type']; depth?: Heading['depth']; children?: MdNode[] } & MiscAttrs
