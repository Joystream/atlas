import { FC, useEffect, useRef, useState } from 'react'

import { EmojiWrapper } from '@/components/EmojiWrapper'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'

import { ExpandButton, StyledCommentText } from './CommentBody.styles'

type CommentBodyProps = {
  children?: string
}
export const CommentBody: FC<CommentBodyProps> = ({ children }) => {
  const [commentExpanded, setCommentExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)

  const firstRender = useRef<boolean>(true)
  const commentBodyRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!firstRender.current || !commentBodyRef.current) {
      return
    }
    setIsTruncated(commentBodyRef.current?.offsetHeight < commentBodyRef.current?.scrollHeight)
    firstRender.current = false
  }, [])

  const toggleCommentExpanded = () => {
    setCommentExpanded((prevState) => !prevState)
  }

  // show only one empty line between paragraphs
  const trimmedComment = children?.trim().replace(/\n\s*\n\s*\n/g, '\n\n')

  return (
    <>
      <EmojiWrapper>
        <StyledCommentText
          as="span"
          ref={commentBodyRef}
          commentExpanded={commentExpanded}
          variant="t200"
          color="default"
        >
          {trimmedComment}
        </StyledCommentText>
      </EmojiWrapper>
      {isTruncated && (
        <ExpandButton
          onClick={toggleCommentExpanded}
          iconPlacement="right"
          size="medium"
          variant="tertiary"
          icon={commentExpanded ? <SvgActionChevronT /> : <SvgActionChevronB />}
        >
          Show {!commentExpanded ? 'more' : 'less'}
        </ExpandButton>
      )}
    </>
  )
}
