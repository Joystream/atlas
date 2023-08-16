import { last } from 'lodash-es'
import { BaseEditor, type Descendant, Editor, Element, Node, NodeEntry, Point, Range, Transforms } from 'slate'

export const serialize = (nodes: Descendant[]): string => nodes.map((node) => Node.string(node)).join('\n')

export const deserialize = (markdown: string): Descendant[] =>
  markdown.split('\n').map((text) => ({ type: 'paragraph', children: [{ text }] }))

export const withShortcuts = <E extends BaseEditor>(editor: E): E => {
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
  link: toggleInlineFormat('link'),
  listOrdered: toggleBlockFormat('listOrdered'),
  listUnordered: toggleBlockFormat('listUnordered'),
  blockquote: toggleBlockFormat('blockquote'),
  thematicBreak: toggleBlockFormat('thematicBreak'),
}

//
// Inline format
//

type InlineFormat = 'emphasis' | 'strong' | 'delete' | 'inlineCode' | 'link'
function toggleInlineFormat(format: InlineFormat) {
  return (editor: Editor) => {
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

    const wasLastLineActive = last(ranges.map(formatInlineRange(editor, format)))
    if (!range || wasLastLineActive) return

    const tag = INLINE_TAGS[format]
    const lenStart = tag[0].length
    const lenEnd = tag[1].length

    if (expandedSelection) {
      return Transforms.move(editor, { distance: lenEnd, edge: 'start', unit: 'offset', reverse: true })
    }

    const { path, offset } = initialSelection.anchor
    const newPoint = { path, offset: offset + lenStart }
    return Transforms.select(editor, { anchor: newPoint, focus: newPoint })
  }
}

const INLINE_TAGS: Record<InlineFormat, [string, string]> = {
  link: ['[', ']()'],
  emphasis: ['_', '_'],
  strong: ['**', '**'],
  delete: ['~~', '~~'],
  inlineCode: ['`', '`'],
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
  (editor: Editor, format: InlineFormat) =>
  (range?: Range | null): boolean => {
    if (unWrapRange(editor, format, range)) return true

    const tag = INLINE_TAGS[format]
    const [start, end] = range ? Range.edges(range) : []
    Transforms.insertText(editor, tag[1], { at: end })
    Transforms.insertText(editor, tag[0], { at: start })
    return false
  }

const unWrapRange = (editor: Editor, format: InlineFormat, range = editor.selection) => {
  if (!range) return false

  const tag = INLINE_TAGS[format]
  const lenStart = tag[0].length
  const lenEnd = tag[1].length

  const [innerStart, innerEnd] = Range.edges(range)
  const beforeStart = Editor.before(editor, innerStart, { distance: lenStart }) ?? innerStart
  const beforeEnd = Editor.after(editor, innerEnd, { distance: lenEnd }) ?? innerEnd
  const path = innerStart.path
  const nodeRange: Range = { anchor: Editor.start(editor, path), focus: Editor.end(editor, path) }
  const outerRange = Range.intersection(nodeRange, { anchor: beforeStart, focus: beforeEnd })

  if (!outerRange) return false

  const text = Editor.string(editor, outerRange)
  const offset1 = text.indexOf(tag[0])
  const offset2 = offset1 < 0 ? -1 : text.indexOf(tag[1], offset1 + 1)
  if (offset2 < 0) return false

  const [start, end] = Range.edges(outerRange)
  const point1 = Editor.after(editor, start, { distance: offset1 }) ?? start
  const point2 = Editor.after(editor, start, { distance: offset2 }) ?? end
  Transforms.delete(editor, { at: point2, distance: lenEnd })
  Transforms.delete(editor, { at: point1, distance: lenStart })
  return true
}

//
// Block format
//

type BlockFormat = `heading-${1 | 2 | 3 | 4 | 5 | 6}` | 'listOrdered' | 'listUnordered' | 'blockquote' | 'thematicBreak'
function toggleBlockFormat(format: BlockFormat) {
  return (editor: Editor) => {
    if (!editor.selection) return

    const nodes = Array.from(Editor.nodes(editor, { at: editor.selection, match: (node) => Element.isElement(node) }))
    const pattern = patternByBlockFormat(format)

    const isActive = nodes.every(([node]) => pattern.test(Node.string(node)))

    if (isActive) {
      return nodes.forEach(([node, path]) => {
        const start = Editor.start(editor, path)

        if (format === 'thematicBreak') {
          return Transforms.delete(editor, { at: start, distance: 2, unit: 'block' })
        }

        const tag = Node.string(node).match(pattern)?.[0] ?? ''
        Transforms.delete(editor, { at: start, distance: tag.length })
      })
    }

    nodes.forEach(clearBlockFormats(editor))

    if (format === 'thematicBreak') {
      const path = editor.selection.anchor.path
      const end = Editor.end(editor, path)
      const nodes = [{ children: [{ text: '' }] }, { children: [{ text: '---' }] }, { children: [{ text: '' }] }]
      Transforms.insertNodes(editor, nodes, { at: end })
      Transforms.setSelection(editor, { anchor: { path, offset: 0 }, focus: { path, offset: 0 } })
      return Transforms.move(editor, { distance: 7, unit: 'line' })
    }

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
      return Transforms.insertText(editor, tag, { at: start })
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

    case 'thematicBreak':
      return /^-{3,}$/

    case 'heading-3':
    case 'heading-1':
    case 'heading-2':
    case 'heading-4':
    case 'heading-5':
    case 'heading-6':
      return /^#+ /
  }
}

const tagByBlockFormat = (format: Exclude<BlockFormat, 'listOrdered' | 'thematicBreak'>): string => {
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
