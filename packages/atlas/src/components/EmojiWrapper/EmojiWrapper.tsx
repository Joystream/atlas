import styled from '@emotion/styled'
import { PropsWithChildren, forwardRef, useEffect, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'
import twemoji from 'twemoji'

export type EmojiWrapperProps = PropsWithChildren<{
  // block prop should be used if the emoji is used outside of text and should behave like block element
  block?: boolean
  className?: string
}>

export const EmojiWrapper = forwardRef<HTMLSpanElement, EmojiWrapperProps>(
  ({ block, className, children }, outsideRef) => {
    const ref = useRef<HTMLDivElement>(null)

    // parse the DOM node and replace all emojis with twemojis
    // no deps array, run on every render
    useEffect(() => {
      if (!ref.current) return

      // todo temporary(?) fix for not loading twemoji. Remove url once its resolved https://github.com/twitter/twemoji/issues/580
      twemoji.parse(ref.current, { base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' })
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
