import React, { useState } from 'react'

import { CommentFieldsFragment } from '@/api/queries'
import { Comment, CommentProps } from '@/components/_comments/Comment'

type CommentThreadProps = {
  repliesCount: number
  replies: (CommentFieldsFragment & { userReactions?: number[] })[] | null
  highlightedCommentId: string | null
} & CommentProps

export const CommentThread: React.FC<CommentThreadProps> = ({
  repliesCount,
  replies,
  commentId,
  video,
  setOriginalComment,
  setHighlightedCommentId,
  highlightedCommentId,
  setShowEditHistory,
  ...commentProps
}) => {
  const [repliesOpen, setRepliesOpen] = useState(false)

  const placeholderItems = !replies ? Array.from({ length: 4 }, () => ({ id: undefined })) : []

  return (
    <>
      <Comment
        highlighted={commentId === highlightedCommentId}
        commentId={commentId}
        video={video}
        setRepliesOpen={setRepliesOpen}
        isRepliesOpen={repliesOpen}
        setOriginalComment={setOriginalComment}
        setHighlightedCommentId={setHighlightedCommentId}
        setShowEditHistory={setShowEditHistory}
        {...commentProps}
        isReplyable={true}
      />
      {repliesOpen &&
        !!repliesCount &&
        (!replies
          ? placeholderItems.map((_, idx) => <Comment key={idx} indented />)
          : replies?.map((comment, idx) => (
              <Comment
                key={`${comment.id}-${idx}`}
                highlighted={comment.id === highlightedCommentId}
                commentId={comment.id}
                video={video}
                indented
                setOriginalComment={setOriginalComment}
                setHighlightedCommentId={setHighlightedCommentId}
                setShowEditHistory={setShowEditHistory}
                isReplyable={false}
              />
            )))}
    </>
  )
}
