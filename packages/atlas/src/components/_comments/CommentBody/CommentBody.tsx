import React, { useEffect, useRef, useState } from 'react'

import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'

import { ExpandButton, StyledCommentText } from './CommentBody.styles'

export const CommentBody = ({ children }: { children?: string }) => {
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

  const trimmedComment = children?.trim()

  return (
    <>
      <StyledCommentText ref={commentBodyRef} commentExpanded={commentExpanded} variant="t200" secondary>
        {trimmedComment}
      </StyledCommentText>
      {isTruncated && (
        <ExpandButton
          onClick={toggleCommentExpanded}
          iconPlacement="right"
          size="medium"
          variant="tertiary"
          textOnly
          icon={commentExpanded ? <SvgActionChevronT /> : <SvgActionChevronB />}
        >
          Show {!commentExpanded ? 'more' : 'less'}
        </ExpandButton>
      )}
    </>
  )
}
