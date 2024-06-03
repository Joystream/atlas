import styled from '@emotion/styled'
import { FC, memo, useState } from 'react'

import { UserCommentReactions, useCommentRepliesConnection } from '@/api/hooks/comments'
import { SvgActionChevronB } from '@/assets/icons'
import { TextButton } from '@/components/_buttons/Button'
import { Comment, CommentProps } from '@/components/_comments/Comment'
import { sizes } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

type CommentThreadProps = {
  highlightedCommentId: string | null
  linkedReplyId?: string | null
  hasAnyReplies: boolean
  userReactionsLookup: UserCommentReactions | undefined
  repliesCount: number
} & CommentProps

const INITIAL_REPLIES_COUNT = 10
const LOAD_MORE_REPLIES_COUNT = 20

const _CommentThread: FC<CommentThreadProps> = ({
  commentId,
  video,
  setHighlightedCommentId,
  highlightedCommentId,
  linkedReplyId,
  hasAnyReplies,
  userReactionsLookup,
  repliesCount,
  ...commentProps
}) => {
  const [repliesOpen, setRepliesOpen] = useState(false)
  const [newReplyId, setNewReplyId] = useState<string | null>(null)

  const { replies, loading, fetchMore, pageInfo } = useCommentRepliesConnection({
    skip: !commentId || !video?.id,
    variables: {
      first: INITIAL_REPLIES_COUNT,
      parentCommentId: commentId || '',
    },
    notifyOnNetworkStatusChange: false,
  })

  const placeholderItems = loading || !newReplyId ? createPlaceholderData(LOAD_MORE_REPLIES_COUNT) : []

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: LOAD_MORE_REPLIES_COUNT,
        after: pageInfo?.endCursor,
      },
    })
  }

  return (
    <>
      <Comment
        highlighted={commentId === highlightedCommentId}
        commentId={commentId}
        video={video}
        setRepliesOpen={setRepliesOpen}
        isRepliesOpen={repliesOpen}
        setHighlightedCommentId={setHighlightedCommentId}
        userReactions={userReactionsLookup && commentId ? userReactionsLookup[commentId] : undefined}
        {...commentProps}
        isReplyable={true}
        onReplyPosted={setNewReplyId}
      />
      {linkedReplyId && !repliesOpen && (
        <Comment
          key={`${commentId}-linked-reply`}
          highlighted={linkedReplyId === highlightedCommentId}
          commentId={linkedReplyId}
          video={video}
          indented
          setHighlightedCommentId={setHighlightedCommentId}
          userReactions={userReactionsLookup ? userReactionsLookup[linkedReplyId] : undefined}
          isReplyable={false}
        />
      )}
      {repliesOpen && (
        <>
          {replies?.map((comment) => (
            <Comment
              key={comment.id}
              highlighted={comment.id === highlightedCommentId}
              commentId={comment.id}
              video={video}
              indented
              setHighlightedCommentId={setHighlightedCommentId}
              userReactions={userReactionsLookup ? userReactionsLookup[comment.id] : undefined}
              isReplyable={false}
            />
          ))}
          {placeholderItems.map((_, idx) => (
            <Comment key={idx} indented />
          ))}
          {pageInfo?.hasNextPage ? (
            <LoadMoreRepliesButton
              variant="tertiary"
              onClick={handleLoadMore}
              icon={<SvgActionChevronB />}
              iconPlacement="right"
            >
              Load more replies
            </LoadMoreRepliesButton>
          ) : null}
        </>
      )}
    </>
  )
}

export const CommentThread = memo(_CommentThread)

const LoadMoreRepliesButton = styled(TextButton)`
  justify-self: start;
  margin-left: ${sizes(14)};
`
