import React, { useCallback, useRef, useState } from 'react'

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
  onEditLabelClick: () => void
  videoAuthorId?: string
  handleCommentReaction: (commentId: string, reactionId: ReactionId) => void
  authorized: boolean
  processingCommentReactionId: string | null
  replies: (CommentFieldsFragment & { userReactions?: number[] })[] | null
} & CommentProps

const COMMENT_BOX_ID = 'comment-box'

export const CommentThread: React.FC<CommentThreadProps> = ({
  onOpenSignInDialog,
  commentId,
  videoId,
  onEditLabelClick,
  videoAuthorId,
  handleCommentReaction,
  authorized,
  processingCommentReactionId,
  reactionPopoverDismissed,
  replies,
  ...commentProps
}) => {
  const [repliesOpen, setRepliesOpen] = useState(false)
  const [replyInputOpen, setReplyInputOpen] = useState(false)
  const [commentBody, setCommentBody] = useState('')
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)
  const { activeMemberId, activeMembership } = useUser()
  const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const { processingCommentReactionId, addComment, commentInputIsProcessingCollection } = useReactionTransactions()
  const [commentInputTextCollection, setCommentInputTextCollection] = useState(new Map<string, string>())
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
    [addComment]
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

  return (
    <>
      <Comment
        {...commentProps}
        onReplyClick={handleReplyClick}
        replyAvatars={replyAvatars}
        onToggleReplies={toggleRepliesOpen}
        repliesOpen={repliesOpen}
        reactionPopoverDismissed={reactionPopoverDismissed}
      />
      <>
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
          (!replies
            ? placeholderItems.map((_, idx) => <Comment key={idx} type="default" loading />)
            : replies?.map((comment, idx) => (
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
                  onEditLabelClick={onEditLabelClick}
                  isAbleToEdit={comment.author.id === activeMemberId}
                  memberHandle={comment.author.handle}
                  memberUrl={absoluteRoutes.viewer.member(comment.author.handle)}
                  reactionPopoverDismissed={reactionPopoverDismissed}
                  memberAvatarUrl={
                    comment.author.metadata.avatar?.__typename === 'AvatarUri'
                      ? comment.author.metadata.avatar?.avatarUri
                      : undefined
                  }
                  type={
                    ['DELETED', 'MODERATED'].includes(comment.status)
                      ? 'deleted'
                      : videoAuthorId === activeMemberId
                      ? 'options'
                      : 'default'
                  }
                />
              )))}
      </>
    </>
  )
}
