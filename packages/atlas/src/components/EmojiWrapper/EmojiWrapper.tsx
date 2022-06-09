import styled from '@emotion/styled'
import React, { forwardRef, useEffect, useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import twemoji from 'twemoji'

export type EmojiWrapperProps = {
  // block prop should be used if the emoji is used outside of text and should behave like block element
  block?: boolean
  className?: string
  children?: React.ReactNode
}

export const EmojiWrapper = forwardRef<HTMLSpanElement, EmojiWrapperProps>(
  ({ block, className, children }, outsideRef) => {
    const ref = useRef<HTMLDivElement>(null)

    // parse the DOM node and replace all emojis with twemojis
    // no deps array, run on every render
    useEffect(() => {
      if (!ref.current) return

      twemoji.parse(ref.current)
    })

    return (
      <Wrapper ref={mergeRefs([outsideRef, ref])} block={block} className={className}>
        {children}
      </Wrapper>
    )
  }
)
EmojiWrapper.displayName = 'EmojiWrapper'

const Wrapper = styled.span<EmojiWrapperProps>`
  img.emoji {
    height: 1em;
    width: 1em;
    vertical-align: -0.1em;
    display: ${({ block }) => (block ? 'block' : 'inline')};
    margin: ${({ block }) => (block ? 0 : '0 0.05em 0 0.1em')};
  }
`
