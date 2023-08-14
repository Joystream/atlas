import { FC, HTMLAttributes, PropsWithChildren } from 'react'

import { EditorNode } from '../MarkdownEditor.types'

export type ElementProps = PropsWithChildren<{
  element: EditorNode
  attributes: HTMLAttributes<HTMLElement>
}>

export const Element: FC<ElementProps> = ({ element, attributes, children }) => {
  const attrs = { ...attributes, children }

  switch (element.type) {
    // Inline
    case 'link':
      return <a href="#" {...attrs} />

    case 'strong':
      return <b {...attrs} />

    case 'emphasis':
      return <i {...attrs} />

    case 'delete':
      return <s {...attrs} />

    case 'inlineCode':
      return <code {...attrs} />

    // Block
    case 'paragraph':
      return <p {...attrs} />

    case 'listItem':
      return <li {...attrs} />

    case 'heading-1':
      return <h1 {...attrs} />
    case 'heading-2':
      return <h2 {...attrs} />
    case 'heading-3':
      return <h3 {...attrs} />
    case 'heading-4':
      return <h4 {...attrs} />
    case 'heading-5':
      return <h5 {...attrs} />
    case 'heading-6':
      return <h6 {...attrs} />

    case 'listOrdered':
      return <ol {...attrs} />
    case 'listUnordered':
      return <ul {...attrs} />

    case 'blockquote':
      return <blockquote {...attrs} />

    case 'code':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      )

    default:
      return <div {...attrs} />
  }
}
