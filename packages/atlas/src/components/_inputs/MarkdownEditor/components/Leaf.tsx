import styled from '@emotion/styled'
import { FC, HTMLAttributes, PropsWithChildren } from 'react'

import { LeafNode } from '../MarkdownEditor.types'

export type LeafProps = PropsWithChildren<{ leaf: LeafNode; attributes: HTMLAttributes<HTMLElement> }>

export const Leaf: FC<LeafProps> = ({ leaf, attributes, children }) => {
  const attrs = { ...attributes, children }

  switch (leaf.type) {
    case 'text':
      return <span {...attrs} />

    case 'mark':
      return <Mark {...attrs} />

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

    default:
      return <span {...attrs} />
  }
}

const Mark = styled.span`
  opacity: 0.5;
`
