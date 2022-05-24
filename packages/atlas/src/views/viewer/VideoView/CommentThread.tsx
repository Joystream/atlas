import React, { useCallback, useMemo, useRef, useState } from 'react'

import { CommentFieldsFragment } from '@/api/queries'
import { Comment, CommentProps } from '@/components/_comments/Comment'
import { CommentInput } from '@/components/_comments/CommentInput'
import { ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useMemberAvatar } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user'

import { getCommentReactions } from './utils'

type CommentThreadProps = {
  onOpenSignInDialog: () => void
  commentId: string
  videoId?: string
  videoAuthorId?: string
  onCommentReaction: (commentId: string, reactionId: ReactionId) => void
  authorized: boolean
  processingCommentReactionId: string | null
  replies: (CommentFieldsFragment & { userReactions?: number[] })[] | null
  channelOwnerMember?: string
  isEditingCommentCollection: Set<string>
  commentInputTextCollection: Map<string, string>
  idx: number
  parentCommentInputIsProcessingCollection: Set<string>
  onEditLabelClick: (replyComment?: CommentFieldsFragment) => void
  onUpdateComment: ({ commentId }: { commentId: string }) => void
  onEditCommentCancel: (comment: CommentFieldsFragment) => void
  onSetIsEditingComment: ({ commentId, value }: { commentId: string; value: boolean }) => void
  onSetCommentInputText: ({ commentId, comment }: { commentId: string; comment: string | undefined }) => void
  onReplyDeleteClick: (replyComment: CommentFieldsFragment) => void
} & CommentProps

export const CommentThread: React.FC<CommentThreadProps> = ({
  onOpenSignInDialog,
  commentId,
  videoId,
  videoAuthorId,
  onCommentReaction,
  authorized,
  processingCommentReactionId,
  reactionPopoverDismissed,
  replies,
  channelOwnerMember,
  isEditingCommentCollection,
  commentInputTextCollection,
  idx,
  parentCommentInputIsProcessingCollection,
  onEditLabelClick,
  onUpdateComment,
  onEditCommentCancel,
  onSetIsEditingComment,
  onSetCommentInputText,
  onReplyDeleteClick,
  ...commentProps
}) => {
  const [repliesOpen, setRepliesOpen] = useState(false)
  const [replyInputOpen, setReplyInputOpen] = useState(false)
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)
  const { activeMemberId, activeMembership } = useUser()
  const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const { addComment, commentInputIsProcessingCollection } = useReactionTransactions()
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const [openCancelConfirmationModal, closeCancelConfirmationModal] = useConfirmationModal()
  const placeholderItems = !replies ? Array.from({ length: 4 }, () => ({ id: undefined })) : []
  const replyAvatars = replies?.map((comment) => ({
    url: comment?.author.metadata.avatar?.__typename === 'AvatarUri' ? comment?.author.metadata.avatar?.avatarUri : '',
    handle: comment.author.handle,
  }))
  const commentBoxId = `reply-comment-box-${idx}`

  const toggleRepliesOpen = () => {
    setRepliesOpen((prevState) => !prevState)
  }

  const handleCancel = () => {
    setReplyInputOpen(false)
    onSetCommentInputText({ commentId: commentBoxId, comment: undefined })
  }

  const handleComment = useCallback(
    async (commentInputId: string, videoId?: string, parentCommentId?: string) => {
      if (!videoId || !commentInputTextCollection.get(commentInputId)) {
        return
      }
      const commentId = await addComment({
        videoId,
        commentBody: commentInputTextCollection.get(commentInputId) ?? '',
        parentCommentId,
        commentInputId,
      })
      onSetCommentInputText({ commentId: commentBoxId, comment: undefined })
      setHighlightedComment(commentId || null)
      setReplyInputOpen(false)
    },
    [addComment, commentBoxId, commentInputTextCollection, onSetCommentInputText]
  )

  const handleReplyClick = () => {
    if (!authorized) {
      onOpenSignInDialog()
      return
    }
    if (replyInputOpen) {
      commentInputRef.current?.focus()
    }
    setReplyInputOpen(true)
    setRepliesOpen(true)
  }

  const handleCancelConfirmation = useCallback(
    (cb: () => void) => {
      openCancelConfirmationModal({
        type: 'warning',
        title: 'Discard changes',
        description: 'Are you sure you want to discard your comment changes?',
        primaryButton: {
          text: 'Confirm and discard',
          onClick: () => {
            closeCancelConfirmationModal()
            cb()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeCancelConfirmationModal()
          },
        },
      })
    },
    [closeCancelConfirmationModal, openCancelConfirmationModal]
  )

  const memoizedContent = useMemo(
    () => (
      <>
        {replies?.map((comment, idx) =>
          isEditingCommentCollection.has(comment.id) ? (
            <CommentInput
              key={`${comment.id}-${idx}`}
              processing={parentCommentInputIsProcessingCollection.has(comment.id)}
              readOnly={!activeMemberId}
              memberHandle={activeMembership?.handle}
              onFocus={() => !activeMemberId && onOpenSignInDialog()}
              onComment={() => onUpdateComment({ commentId: comment.id })}
              value={commentInputTextCollection.get(comment.id) ?? ''}
              hasInitialValueChanged={comment.text !== commentInputTextCollection.get(comment.id)}
              onChange={(e) => onSetCommentInputText({ commentId: comment.id, comment: e.target.value })}
              onCancel={() => onEditCommentCancel(comment)}
              withoutOutlineBox
              memberAvatarUrl={memberAvatarUrl}
              indented
            />
          ) : (
            <Comment
              id={comment.id}
              author={comment.author}
              highlighted={comment.id === highlightedComment}
              reactions={getCommentReactions({
                commentId: comment.id,
                userReactions: comment.userReactions,
                reactionsCount: comment.reactionsCountByReactionId,
                activeMemberId,
                processingCommentReactionId,
              })}
              key={`${comment.id}-${idx}`}
              loading={!comment.id}
              createdAt={new Date(comment.createdAt)}
              text={comment.text}
              isEdited={comment.isEdited}
              onReactionClick={(reactionId) => onCommentReaction(comment.id, reactionId)}
              indented
              onEditLabelClick={() => onEditLabelClick(comment)}
              isAbleToEdit={comment.author.id === activeMemberId}
              memberHandle={comment.author.handle}
              memberUrl={absoluteRoutes.viewer.member(comment.author.handle)}
              reactionPopoverDismissed={reactionPopoverDismissed}
              onEditClick={() => {
                onSetIsEditingComment({ commentId: comment.id, value: true })
                onSetCommentInputText({ commentId: comment.id, comment: comment.text })
              }}
              onDeleteClick={() => onReplyDeleteClick(comment)}
              videoId={videoId}
              type={
                ['DELETED', 'MODERATED'].includes(comment.status)
                  ? 'deleted'
                  : channelOwnerMember === activeMemberId || comment.author.id === activeMemberId
                  ? 'options'
                  : 'default'
              }
            />
          )
        )}
      </>
    ),
    [
      replies,
      isEditingCommentCollection,
      parentCommentInputIsProcessingCollection,
      activeMemberId,
      activeMembership?.handle,
      commentInputTextCollection,
      memberAvatarUrl,
      highlightedComment,
      processingCommentReactionId,
      reactionPopoverDismissed,
      videoId,
      channelOwnerMember,
      onOpenSignInDialog,
      onUpdateComment,
      onSetCommentInputText,
      onEditCommentCancel,
      onCommentReaction,
      onEditLabelClick,
      onSetIsEditingComment,
      onReplyDeleteClick,
    ]
  )

  return (
    <>
      <Comment
        {...commentProps}
        id={commentId}
        onReplyClick={handleReplyClick}
        onEditLabelClick={onEditLabelClick}
        replyAvatars={replyAvatars}
        onToggleReplies={toggleRepliesOpen}
        repliesOpen={repliesOpen}
        reactionPopoverDismissed={reactionPopoverDismissed}
        videoId={videoId}
      />
      {replyInputOpen && (
        <CommentInput
          ref={commentInputRef}
          memberAvatarUrl={memberAvatarUrl}
          isMemberAvatarLoading={isMemberAvatarLoading}
          processing={commentInputIsProcessingCollection.has(commentBoxId)}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          onFocus={onOpenSignInDialog}
          onComment={() => handleComment(commentBoxId, videoId, commentId)}
          hasInitialValueChanged={!!commentInputTextCollection.get(commentBoxId)}
          value={commentInputTextCollection.get(commentBoxId) ?? ''}
          withoutOutlineBox
          onChange={(event) => onSetCommentInputText({ commentId: commentBoxId, comment: event.target.value })}
          indented
          onCancel={() => {
            commentInputTextCollection.get(commentBoxId) ? handleCancelConfirmation(handleCancel) : handleCancel()
          }}
          initialFocus
          reply
        />
      )}
      {repliesOpen &&
        !!commentProps.repliesCount &&
        (!replies
          ? placeholderItems.map((_, idx) => <Comment key={idx} type="default" loading indented />)
          : memoizedContent)}
    </>
  )
}
