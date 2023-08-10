import { FC, HTMLAttributes, PropsWithChildren } from 'react'

import { ElementNode } from '../MarkdownEditor.types'

export type ElementProps = PropsWithChildren<{ element: ElementNode; attributes: HTMLAttributes<HTMLElement> }>

export const Element: FC<ElementProps> = ({ element, attributes, children }) => {
  const attrs = { ...attributes, children }

  switch (element.type) {
    case 'paragraph':
      return <p {...attrs} />

    case 'heading':
      switch (element.depth) {
        case 1:
          return <h1 {...attrs} />
        case 2:
          return <h2 {...attrs} />
        default:
          return <h3 {...attrs} />
      }
    case 'listItem':
      return <li {...attrs} />

    case 'list':
      return element.ordered ? <ol {...attrs} /> : <ul {...attrs} />

    case 'blockquote':
      return <blockquote {...attrs} />

    case 'code':
      return <pre {...attrs} />

    default:
      return <div {...attrs} />
  }
}
