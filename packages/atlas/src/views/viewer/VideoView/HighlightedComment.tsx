import React, { useCallback } from 'react'

import { useComment } from '@/api/hooks'
import { CommentFieldsFragment, CommentStatus, VideoFieldsFragment } from '@/api/queries'
import { Comment } from '@/components/_comments/Comment'
import { ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'

import { getCommentReactions } from './utils'

type HighlightedCommentProps = {
  commentId: string | null
  highLighted: boolean
  onEditLabelClick: (comment: CommentFieldsFragment) => void
  reactionPopoverDismissed: boolean
  authorized: boolean
  activeMemberId: string | null
  onCommentReaction: (commentId: string, reactionId: ReactionId) => void
  onDeleteComment: (comment: CommentFieldsFragment, video: VideoFieldsFragment) => void
  processingCommentReactionId: string | null
  video?: VideoFieldsFragment | null
}

export const HighlightedComment: React.FC<HighlightedCommentProps> = ({
  commentId,
  highLighted,
  onEditLabelClick,
  reactionPopoverDismissed,
  authorized,
  activeMemberId,
  onCommentReaction,
  onDeleteComment,
  processingCommentReactionId,
  video,
}) => {
  const { comment, loading: commentLoading } = useComment(commentId || '', activeMemberId || '', video?.id || '', {
    skip: !commentId,
  })
  const { comment: parentComment, loading: parentCommentLoading } = useComment(
    comment?.parentCommentId || '',
    activeMemberId || '',
    video?.id || '',
    {
      skip: !comment || !comment.parentCommentId,
    }
  )

  const getComment = useCallback(
    (comment: CommentFieldsFragment & { userReactions?: number[] }, highlighted: boolean, indented?: boolean) => (
      <Comment
        indented={indented}
        highlighted={highlighted}
        videoId={video?.id}
        id={comment.id}
        reactions={getCommentReactions({
          commentId: comment.id,
          userReactions: comment.userReactions,
          reactionsCount: comment.reactionsCountByReactionId,
          activeMemberId,
          processingCommentReactionId,
        })}
        onDeleteClick={() => video && onDeleteComment(comment, video)}
        onEditLabelClick={() => onEditLabelClick(comment)}
        loading={!comment.id}
        createdAt={new Date(comment.createdAt)}
        text={comment.text}
        reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
        isEdited={comment.isEdited}
        onReactionClick={(reactionId) => onCommentReaction(comment.id, reactionId)}
        isAbleToEdit={comment.author.id === activeMemberId}
        isModerated={comment.status === CommentStatus.Moderated}
        memberHandle={comment.author.handle}
        memberUrl={absoluteRoutes.viewer.member(comment.author.handle)}
        memberAvatarUrl={
          comment.author.metadata.avatar?.__typename === 'AvatarUri'
            ? comment.author.metadata.avatar?.avatarUri
            : undefined
        }
        type={
          ['DELETED', 'MODERATED'].includes(comment.status)
            ? 'deleted'
            : video?.channel.ownerMember?.id === activeMemberId || comment.author.id === activeMemberId
            ? 'options'
            : 'default'
        }
      />
    ),
    [
      activeMemberId,
      authorized,
      onCommentReaction,
      onDeleteComment,
      onEditLabelClick,
      processingCommentReactionId,
      reactionPopoverDismissed,
      video,
    ]
  )

  return (
    <>
      {comment && !comment.parentCommentId && !parentCommentLoading ? getComment(comment, highLighted) : null}
      {parentComment && getComment(parentComment, false)}
      {parentComment && comment && getComment(comment, highLighted, true)}
      {(commentLoading || parentCommentLoading) && <Comment type="default" loading />}
      {parentCommentLoading && <Comment type="default" loading indented />}
    </>
  )
}
