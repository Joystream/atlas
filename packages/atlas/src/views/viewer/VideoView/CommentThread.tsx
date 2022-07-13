import styled from '@emotion/styled'
import { FC, memo, useState } from 'react'

import { UserCommentReactions, useComment, useCommentRepliesConnection } from '@/api/hooks'
import { TextButton } from '@/components/_buttons/Button'
import { Comment, CommentProps } from '@/components/_comments/Comment'
import { SvgActionChevronB } from '@/components/_icons'
import { sizes } from '@/styles'

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

  const { replies, totalCount, loading, fetchMore, pageInfo } = useCommentRepliesConnection({
    skip: !commentId || !video?.id || !repliesOpen || !hasAnyReplies,
    variables: {
      first: INITIAL_REPLIES_COUNT,
      parentCommentId: commentId || '',
    },
    notifyOnNetworkStatusChange: true,
  })

  const { comment: newReply } = useComment({ commentId: newReplyId || '' }, { skip: !newReplyId })

  const allRepliesCount = replies.length
  const repliesLeftToLoadCount = totalCount - allRepliesCount
  const allRepliesContainNewReply = !!replies.find((r) => r.id === newReplyId)

  const placeholderCount =
    repliesLeftToLoadCount || (repliesCount > INITIAL_REPLIES_COUNT ? INITIAL_REPLIES_COUNT : repliesCount)
  const placeholderItems = loading
    ? Array.from({ length: placeholderCount }, () => ({
        id: undefined,
      }))
    : []

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
          {repliesLeftToLoadCount > 0 ? (
            <LoadMoreRepliesButton
              variant="tertiary"
              onClick={handleLoadMore}
              icon={<SvgActionChevronB />}
              iconPlacement="right"
            >
              Load more replies ({repliesLeftToLoadCount})
            </LoadMoreRepliesButton>
          ) : null}
          {newReplyId && !allRepliesContainNewReply ? (
            newReply ? (
              <Comment
                key={newReply?.id}
                highlighted={newReply.id === highlightedCommentId}
                commentId={newReply.id}
                video={video}
                indented
                setHighlightedCommentId={setHighlightedCommentId}
                userReactions={userReactionsLookup ? userReactionsLookup[newReply.id] : undefined}
                isReplyable={false}
              />
            ) : (
              <Comment indented /> // new reply is loading, display an empty skeleton Comment
            )
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
