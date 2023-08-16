import { type Descendant, Editor, Element, Node, NodeEntry, Point, Range, Transforms } from 'slate'

export const serialize = (nodes: Descendant[]): string => nodes.map((node) => Node.string(node)).join('\n')

export const deserialize = (markdown: string): Descendant[] =>
  markdown.split('\n').map((text) => ({ type: 'paragraph', children: [{ text }] }))

export const toggleFormat = {
  heading: toggleBlockFormat('heading-3'),
  strong: toggleInlineFormat('strong'),
  emphasis: toggleInlineFormat('emphasis'),
  delete: toggleInlineFormat('delete'),
  listOrdered: toggleBlockFormat('listOrdered'),
  listUnordered: toggleBlockFormat('listUnordered'),
  blockquote: toggleBlockFormat('blockquote'),
}

type InlineFormat = 'emphasis' | 'strong' | 'delete' | 'inlineCode'
function toggleInlineFormat(format: InlineFormat) {
  return (editor: Editor) => {
    const tag = INLINE_TAGS[format]
    const len = tag.length

    const initialSelection = editor.selection
    const range =
      initialSelection &&
      (Range.isExpanded(initialSelection) ? editor.selection : currentWord(editor, initialSelection))

    if (unWrapRange(editor, tag, range)) return

    const [start, end] = range ? Range.edges(range) : []
    Transforms.insertText(editor, tag, { at: end })
    Transforms.insertText(editor, tag, { at: start })

    if (!range || (!Range.isExpanded(initialSelection) && Range.isExpanded(range))) return

    Transforms.move(editor, { distance: len, edge: 'end', unit: 'offset', reverse: true })

    if (!Range.isExpanded(initialSelection)) {
      Transforms.move(editor, { distance: len, edge: 'end', unit: 'offset', reverse: true })
    }
  }
}

type BlockFormat = `heading-${1 | 2 | 3 | 4 | 5 | 6}` | 'listOrdered' | 'listUnordered' | 'blockquote'
function toggleBlockFormat(format: BlockFormat) {
  return (editor: Editor) => {
    if (!editor.selection) return

    const nodes = Array.from(Editor.nodes(editor, { at: editor.selection, match: (node) => Element.isElement(node) }))
    const re = reByBlockFormat(format)

    const isActive = nodes.every(([node]) => re.test(Node.string(node)))

    if (isActive) {
      return nodes.forEach(([node, path]) => {
        const start = Editor.start(editor, path)
        const tag = Node.string(node).match(re)?.[0] ?? ''
        Transforms.delete(editor, { at: start, distance: tag.length })
      })
    }

    nodes.forEach(clearBlockFormats(editor))

    if (format === 'listOrdered') {
      const prevLine = Editor.before(editor, Range.start(editor.selection).path, { unit: 'line' })
      const prevText = prevLine && Editor.string(editor, prevLine.path)
      const listStart = 1 + (prevText?.match(/^[1-9]\d*(?=\.)/)?.map(Number)[0] ?? 0)

      return nodes.forEach(([, path], index) => {
        const tag = `${listStart + index}. `
        const start = Editor.start(editor, path)
        Transforms.insertText(editor, tag, { at: start })
      })
    }

    const tag = tagByBlockFormat(format)
    nodes.forEach(([, path]) => {
      const start = Editor.start(editor, path)
      Transforms.insertText(editor, tag, { at: start })
    })
  }
}

const clearBlockFormats =
  (editor: Editor) =>
  ([node, path]: NodeEntry) => {
    const start = Editor.start(editor, path)
    const tag = Node.string(node).match(/^(#+|[1-9]\d*\.|-|>) /)?.[0]
    if (tag) {
      Transforms.delete(editor, { at: start, distance: tag.length })
    }
  }

const unWrapRange = (editor: Editor, tag: string, range = editor.selection) => {
  if (!range) return false

  const len = tag.length

  const [start, end] = Range.edges(range)
  const beforeRange: Range = { anchor: start, focus: { path: start.path, offset: start.offset - len } }
  const beforeText = Editor.string(editor, beforeRange)
  if (beforeText !== tag) return false

  const afterRange: Range = end && { anchor: end, focus: { path: end.path, offset: end.offset + len } }
  const afterText = Editor.string(editor, afterRange)
  if (afterText !== tag) return false

  Transforms.delete(editor, { at: afterRange })
  Transforms.delete(editor, { at: beforeRange })
  return true
}

const currentWord = (editor: Editor, selection: Range): Range => {
  const charAfter = textFromPoint(editor, selection.anchor, 1)
  if (!charAfter) return selection

  if (/[A-Za-z]/.test(charAfter)) {
    const after = Editor.after(editor, selection, { unit: 'word' })
    if (!after) return selection // this shouldn't happen
    const before = Editor.before(editor, after, { unit: 'word' })
    if (!before) return selection // this shouldn't happen
    return { anchor: before, focus: after }
  }

  const charBefore = textFromPoint(editor, selection.anchor, -1)
  if (!charBefore || !/[A-Za-z]/.test(charBefore)) return selection

  const before = Editor.before(editor, selection.anchor, { unit: 'word' })
  if (!before) return selection // this shouldn't happen
  const after = Editor.after(editor, before, { unit: 'word' })
  if (!after) return selection // this shouldn't happen
  return { anchor: before, focus: after }
}

const textFromPoint = (editor: Editor, anchor: Point, distance: number): string | undefined => {
  const fn = distance > 0 ? Editor.after : Editor.before
  const focus = fn(editor, anchor, { distance: Math.abs(distance) })
  const range: Range | undefined = focus && { anchor, focus }
  return range && Editor.string(editor, range)
}

const INLINE_TAGS = {
  emphasis: '_',
  strong: '**',
  delete: '~~',
  inlineCode: '`',
}

const reByBlockFormat = (format: BlockFormat): RegExp => {
  switch (format) {
    case 'listUnordered':
      return /^- /

    case 'listOrdered':
      return /^[1-9]\d*\. /

    case 'blockquote':
      return /^> /

    case 'heading-3':
    case 'heading-1':
    case 'heading-2':
    case 'heading-4':
    case 'heading-5':
    case 'heading-6':
      return /^#+ /
  }
}

const tagByBlockFormat = (format: Exclude<BlockFormat, 'listOrdered'>): string => {
  switch (format) {
    case 'listUnordered':
      return '- '

    case 'blockquote':
      return '> '

    case 'heading-3':
    case 'heading-1':
    case 'heading-2':
    case 'heading-4':
    case 'heading-5':
    case 'heading-6': {
      const depth = Number(format.slice(8))
      return `${'#'.repeat(depth)} `
    }
  }
}
