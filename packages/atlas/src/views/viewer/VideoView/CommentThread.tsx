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
  handleCommentReaction: (commentId: string, reactionId: ReactionId) => void
  authorized: boolean
  processingCommentReactionId: string | null
  replies: (CommentFieldsFragment & { userReactions?: number[] })[] | null
  channelOwnerMember?: string
  isEditingCommentCollection: Set<string>
  commentInputTextCollection: Map<string, string>
  commentInputIsProcessingCollection: Set<string>
  onEditLabelClick: (replyComment?: CommentFieldsFragment) => void
  onUpdateComment: ({ commentId }: { commentId: string }) => void
  onEditCommentCancel: (comment: CommentFieldsFragment) => void
  onSetIsEditingComment: ({ commentId, value }: { commentId: string; value: boolean }) => void
  onSetCommentInputText: ({ commentId, comment }: { commentId: string; comment: string | undefined }) => void
  onReplyDeleteClick: (replyComment: CommentFieldsFragment) => void
} & CommentProps

const COMMENT_BOX_ID = 'comment-box'

export const CommentThread: React.FC<CommentThreadProps> = ({
  onOpenSignInDialog,
  commentId,
  videoId,
  videoAuthorId,
  handleCommentReaction,
  authorized,
  processingCommentReactionId,
  reactionPopoverDismissed,
  replies,
  channelOwnerMember,
  isEditingCommentCollection,
  commentInputTextCollection,
  commentInputIsProcessingCollection,
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
  const [commentBody, setCommentBody] = useState('')
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)
  const { activeMemberId, activeMembership } = useUser()
  const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const { addComment } = useReactionTransactions()
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const [openCancelConfirmationModal, closeCancelConfirmationModal] = useConfirmationModal()
  const placeholderItems = !replies ? Array.from({ length: 4 }, () => ({ id: undefined })) : []
  const replyAvatars = replies?.map((comment) => ({
    url: comment?.author.metadata.avatar?.__typename === 'AvatarUri' ? comment?.author.metadata.avatar?.avatarUri : '',
    handle: comment.author.handle,
  }))

  const toggleRepliesOpen = () => {
    setRepliesOpen((prevState) => !prevState)
  }

  const handleCancel = () => {
    setReplyInputOpen(false)
    setCommentBody('')
  }

  const handleComment = useCallback(
    async (commentInputId: string, videoId?: string, commentBody?: string, parentCommentId?: string) => {
      if (!videoId || !commentBody) {
        return
      }
      const commentId = await addComment({
        videoId,
        commentBody: commentInputTextCollection.get(commentInputId) ?? '',
        parentCommentId,
        commentInputId,
      })
      setCommentBody('')
      setHighlightedComment(commentId || null)
      setReplyInputOpen(false)
    },
    [addComment, commentInputTextCollection]
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
              processing={commentInputIsProcessingCollection.has(comment.id)}
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
              onReactionClick={(reactionId) => handleCommentReaction(comment.id, reactionId)}
              indented
              onEditLabelClick={() => onEditLabelClick(comment)}
              isAbleToEdit={comment.author.id === activeMemberId}
              memberHandle={comment.author.handle}
              memberUrl={absoluteRoutes.viewer.member(comment.author.handle)}
              reactionPopoverDismissed={reactionPopoverDismissed}
              memberAvatarUrl={
                comment.author.metadata.avatar?.__typename === 'AvatarUri'
                  ? comment.author.metadata.avatar?.avatarUri
                  : undefined
              }
              onEditClick={() => {
                onSetIsEditingComment({ commentId: comment.id, value: true })
                onSetCommentInputText({ commentId: comment.id, comment: comment.text })
              }}
              onDeleteClick={() => onReplyDeleteClick(comment)}
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
      activeMemberId,
      activeMembership?.handle,
      channelOwnerMember,
      commentInputIsProcessingCollection,
      commentInputTextCollection,
      handleCommentReaction,
      highlightedComment,
      isEditingCommentCollection,
      memberAvatarUrl,
      onEditCommentCancel,
      onEditLabelClick,
      onOpenSignInDialog,
      onReplyDeleteClick,
      onSetCommentInputText,
      onSetIsEditingComment,
      onUpdateComment,
      processingCommentReactionId,
      reactionPopoverDismissed,
      replies,
    ]
  )

  return (
    <>
      <Comment
        {...commentProps}
        onReplyClick={handleReplyClick}
        onEditLabelClick={onEditLabelClick}
        replyAvatars={replyAvatars}
        onToggleReplies={toggleRepliesOpen}
        repliesOpen={repliesOpen}
        reactionPopoverDismissed={reactionPopoverDismissed}
      />
      {replyInputOpen && (
        <CommentInput
          ref={commentInputRef}
          memberAvatarUrl={memberAvatarUrl}
          isMemberAvatarLoading={isMemberAvatarLoading}
          processing={commentInputIsProcessingCollection.has(COMMENT_BOX_ID)}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          onFocus={onOpenSignInDialog}
          onComment={() => handleComment(COMMENT_BOX_ID, videoId, commentBody, commentId)}
          hasInitialValueChanged={!!commentInputTextCollection.get(COMMENT_BOX_ID)}
          value={commentBody}
          withoutOutlineBox
          onChange={(e) => setCommentBody(e.currentTarget.value)}
          indented
          onCancel={() => {
            commentBody.length ? handleCancelConfirmation(handleCancel) : handleCancel()
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
