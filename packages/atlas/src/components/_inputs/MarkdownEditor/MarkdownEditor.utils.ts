import { last } from 'lodash-es'
import { type Descendant, Editor, Element, Node, NodeEntry, Point, Range, Transforms } from 'slate'

export const serialize = (nodes: Descendant[]): string => nodes.map((node) => Node.string(node)).join('\n')

export const deserialize = (markdown: string): Descendant[] =>
  markdown.split('\n').map((text) => ({ type: 'paragraph', children: [{ text }] }))

export const withShortcuts = (editor: Editor): Editor => {
  const { splitNodes } = editor

  editor.splitNodes = (options) => {
    const prevRange = editor.selection

    splitNodes(options)

    const prevText = prevRange && Editor.string(editor, prevRange.anchor.path)
    const [, prefix, content] = prevText?.match(/^((?:-|\*|\+|>|[1-9]\d*\.) )(.*)/) ?? []

    if (!prefix) return

    if (!content) {
      return Transforms.delete(editor, { distance: 2, unit: 'block', reverse: true })
    }

    const listNumber = prefix.match(/^[1-9]\d*/)?.map(Number)?.[0]
    if (listNumber) {
      return Transforms.insertText(editor, `${listNumber + 1}. `)
    }

    Transforms.insertText(editor, prefix)
  }

  return editor
}

export const toggleFormat = {
  heading: toggleBlockFormat('heading-3'),
  strong: toggleInlineFormat('strong'),
  emphasis: toggleInlineFormat('emphasis'),
  delete: toggleInlineFormat('delete'),
  listOrdered: toggleBlockFormat('listOrdered'),
  listUnordered: toggleBlockFormat('listUnordered'),
  blockquote: toggleBlockFormat('blockquote'),
}

//
// Inline format
//

type InlineFormat = 'emphasis' | 'strong' | 'delete' | 'inlineCode'
function toggleInlineFormat(format: InlineFormat) {
  return (editor: Editor) => {
    const tag = INLINE_TAGS[format]
    const len = tag.length

    const initialSelection = editor.selection
    const expandedSelection = initialSelection && Range.isExpanded(initialSelection) && initialSelection
    const range = expandedSelection || (initialSelection && currentWord(editor, initialSelection))
    const ranges = (expandedSelection &&
      Array.from(Editor.nodes(editor, { at: expandedSelection, match: (node) => Element.isElement(node) })).flatMap(
        ([, path]) => {
          const nodeRange = { anchor: Editor.start(editor, path), focus: Editor.end(editor, path) }
          return Range.intersection(nodeRange, expandedSelection) ?? []
        }
      )) || [range]

    const wasLastLineActive = last(ranges.map(formatInlineRange(editor, tag)))
    if (!range || wasLastLineActive) return

    if (expandedSelection) {
      return Transforms.move(editor, { distance: len, edge: 'start', unit: 'offset', reverse: true })
    }

    const { path, offset } = initialSelection.anchor
    const newPoint = { path, offset: offset + len }
    return Transforms.select(editor, { anchor: newPoint, focus: newPoint })
  }
}

const INLINE_TAGS = {
  emphasis: '_',
  strong: '**',
  delete: '~~',
  inlineCode: '`',
}

const currentWord = (editor: Editor, selection: Range): Range => {
  const wordPattern = /[\dA-Za-z]/
  const charAfter = textFromPoint(editor, selection.anchor, 1)
  if (charAfter && wordPattern.test(charAfter)) {
    const after = Editor.after(editor, selection, { unit: 'word' })
    if (!after) return selection // this shouldn't happen
    const before = Editor.before(editor, after, { unit: 'word' })
    if (!before) return selection // this shouldn't happen
    return { anchor: before, focus: after }
  }

  const charBefore = textFromPoint(editor, selection.anchor, -1)
  if (charBefore && wordPattern.test(charBefore)) {
    const before = Editor.before(editor, selection.anchor, { unit: 'word' })
    if (!before) return selection // this shouldn't happen
    const after = Editor.after(editor, before, { unit: 'word' })
    if (!after) return selection // this shouldn't happen
    return { anchor: before, focus: after }
  }

  return selection
}

const textFromPoint = (editor: Editor, anchor: Point, distance: number): string | undefined => {
  const fn = distance > 0 ? Editor.after : Editor.before
  const focus = fn(editor, anchor, { distance: Math.abs(distance) })
  const range: Range | undefined = focus && { anchor, focus }
  return range && Editor.string(editor, range)
}

const formatInlineRange =
  (editor: Editor, tag: string) =>
  (range?: Range | null): boolean => {
    if (unWrapRange(editor, tag, range)) return true

    const [start, end] = range ? Range.edges(range) : []
    Transforms.insertText(editor, tag, { at: end })
    Transforms.insertText(editor, tag, { at: start })
    return false
  }

const unWrapRange = (editor: Editor, tag: string, range = editor.selection) => {
  if (!range) return false

  const len = tag.length

  const [innerStart, innerEnd] = Range.edges(range)
  const beforeStart = Editor.before(editor, innerStart, { distance: len }) ?? innerStart
  const beforeEnd = Editor.after(editor, innerEnd, { distance: len }) ?? innerEnd
  const path = innerStart.path
  const nodeRange: Range = { anchor: Editor.start(editor, path), focus: Editor.end(editor, path) }
  const outerRange = Range.intersection(nodeRange, { anchor: beforeStart, focus: beforeEnd })

  if (!outerRange) return false

  const text = Editor.string(editor, outerRange)
  const offset1 = text.indexOf(tag)
  const offset2 = offset1 < 0 ? -1 : text.indexOf(tag, offset1 + 1)
  if (offset2 < 0) return false

  const [start, end] = Range.edges(outerRange)
  const point1 = Editor.after(editor, start, { distance: offset1 }) ?? start
  const point2 = Editor.after(editor, start, { distance: offset2 }) ?? end
  Transforms.delete(editor, { at: point2, distance: len })
  Transforms.delete(editor, { at: point1, distance: len })
  return true
}

//
// Block format
//

type BlockFormat = `heading-${1 | 2 | 3 | 4 | 5 | 6}` | 'listOrdered' | 'listUnordered' | 'blockquote'
function toggleBlockFormat(format: BlockFormat) {
  return (editor: Editor) => {
    if (!editor.selection) return

    const nodes = Array.from(Editor.nodes(editor, { at: editor.selection, match: (node) => Element.isElement(node) }))
    const pattern = patternByBlockFormat(format)

    const isActive = nodes.every(([node]) => pattern.test(Node.string(node)))

    if (isActive) {
      return nodes.forEach(([node, path]) => {
        const start = Editor.start(editor, path)
        const tag = Node.string(node).match(pattern)?.[0] ?? ''
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

const patternByBlockFormat = (format: BlockFormat): RegExp => {
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
