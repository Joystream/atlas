import React, { useRef, useState } from 'react'

import { useComment } from '@/api/hooks'
import { CommentFieldsFragment, CommentStatus, VideoFieldsFragment } from '@/api/queries'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { ReactionId } from '@/config/reactions'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { ExtrinsicStatus } from '@/joystream-lib'
import { useMemberAvatar } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { useTransactionManagerStore } from '@/providers/transactions'
import { useUser } from '@/providers/user'

import { getCommentReactions } from './Comment.utils'
import { InternalComment } from './InternalComment'

import { CommentEditHistory } from '../CommentEditHistory'
import { CommentInput } from '../CommentInput'
import { CommentRowProps } from '../CommentRow'

export type CommentProps = {
  commentId?: string
  video?: VideoFieldsFragment | null
  userReactions?: number[]
  isReplyable?: boolean
  setHighlightedCommentId?: React.Dispatch<React.SetStateAction<string | null>>
  setRepliesOpen?: React.Dispatch<React.SetStateAction<boolean>>
  isRepliesOpen?: boolean
  onReplyPosted?: (replyId: string) => void
} & Exclude<CommentRowProps, 'memberAvatarUrl' | 'isMemberAvatarLoading'>

export const Comment: React.FC<CommentProps> = React.memo(
  ({
    commentId,
    video,
    userReactions,
    setHighlightedCommentId,
    setRepliesOpen,
    isRepliesOpen,
    isReplyable,
    onReplyPosted,
    ...rest
  }) => {
    const replyCommentInputRef = useRef<HTMLTextAreaElement>(null)
    const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
    const [showEditHistory, setShowEditHistory] = useState(false)
    const [replyInputOpen, setReplyInputOpen] = useState(false)
    const [editCommentInputIsProcessing, setEditCommentInputIsProcessing] = useState(false)
    const [replyCommentInputIsProcessing, setReplyCommentInputIsProcessing] = useState(false)
    const [editCommentInputText, setEditCommentInputText] = useState('')
    const [replyCommentInputText, setReplyCommentInputText] = useState('')
    const [isCommentProcessing, setIsCommentProcessing] = useState(false)
    const [isEditingComment, setIsEditingComment] = useState(false)
    const [processingReactionId, setProcessingReactionId] = useState<string | null>(null)

    const { activeMemberId, activeMembership, activeAccountId, signIn } = useUser()
    const { comment } = useComment(
      { commentId: commentId ?? '' },
      {
        skip: !commentId,
      }
    )
    const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)

    const commentIdQueryParam = useRouterQuery(QUERY_PARAMS.COMMENT_ID)
    const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
    const { openSignInDialog } = useDisplaySignInDialog()
    const [openModal, closeModal] = useConfirmationModal()
    const { reactToComment, deleteComment, moderateComment, updateComment, addComment } = useReactionTransactions()
    const isTransactionPendingSignature = useTransactionManagerStore((state) =>
      Object.values(state.transactions).some((tx) => tx.status === ExtrinsicStatus.Unsigned)
    )

    const authorized = activeMemberId && activeAccountId

    const handleDeleteComment = (comment: CommentFieldsFragment) => {
      const isChannelOwner = video?.channel.ownerMember?.id === activeMemberId && comment.author.id !== activeMemberId
      openModal({
        type: 'destructive',
        title: 'Delete this comment?',
        description: 'Are you sure you want to delete this comment? This cannot be undone.',
        primaryButton: {
          text: 'Delete comment',
          onClick: async () => {
            setIsCommentProcessing(true)
            closeModal()
            isChannelOwner
              ? await moderateComment(
                  comment.id,
                  video?.channel.id,
                  comment.author.handle,
                  video.title || '',
                  video?.id
                )
              : await deleteComment(comment.id, video?.title || '', video?.id)
            setIsCommentProcessing(false)
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeModal(),
        },
      })
    }

    const handleCancelConfirmation = (cb: () => void, isEdit = true) => {
      openModal({
        type: 'warning',
        title: isEdit ? 'Discard changes?' : 'Discard comment?',
        description: isEdit
          ? 'Are you sure you want to discard your comment changes?'
          : 'Are you sure you want to discard your comment?',
        primaryButton: {
          text: 'Confirm and discard',
          onClick: () => {
            closeModal()
            cb()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeModal()
          },
        },
        onExitClick: () => {
          closeModal()
        },
      })
    }

    const handleCancelReply = () => {
      setReplyInputOpen(false)
      setReplyCommentInputText('')
    }

    const handleCancelEditComment = () => {
      setIsEditingComment(false)
      setEditCommentInputText('')
    }

    const handleUpdateComment = async () => {
      if (!video?.id || !editCommentInputText || !comment) {
        return
      }

      setEditCommentInputIsProcessing(true)
      const success = await updateComment({
        videoId: video.id,
        commentBody: editCommentInputText ?? '',
        commentId: comment.id,
      })
      setEditCommentInputIsProcessing(false)

      if (success) {
        setEditCommentInputText('')
        setHighlightedCommentId?.(comment?.id ?? null)
        setIsEditingComment(false)
      }
    }
    const handleCommentReaction = async (commentId: string, reactionId: ReactionId) => {
      if (authorized) {
        setProcessingReactionId(reactionId.toString())
        await reactToComment(commentId, video?.id || '', reactionId)
        setProcessingReactionId(null)
      } else {
        openSignInDialog({ onConfirm: signIn })
      }
    }
    const handleComment = async () => {
      if (!video || !replyCommentInputText || !comment) {
        return
      }

      setReplyCommentInputIsProcessing(true)
      const newCommentId = await addComment({
        videoId: video.id,
        commentBody: replyCommentInputText,
        parentCommentId: comment.id,
      })
      setReplyCommentInputIsProcessing(false)
      setReplyCommentInputText('')
      setHighlightedCommentId?.(newCommentId || null)
      onReplyPosted?.(newCommentId || '')
      setReplyInputOpen(false)
    }

    const handleReplyClick = () => {
      if (!authorized) {
        handleOpenSignInDialog()
        return
      }
      if (replyInputOpen) {
        replyCommentInputRef.current?.focus()
      }
      setReplyInputOpen(true)
      setRepliesOpen?.(true)
    }

    const handleOnEditClick = () => {
      if (comment) {
        setIsEditingComment(true)
        setEditCommentInputText?.(comment.text)
      }
    }

    const handleOpenSignInDialog = () => !activeMemberId && openSignInDialog({ onConfirm: signIn })

    const handleOnEditLabelClick = () => {
      setShowEditHistory?.(true)
      comment && setOriginalComment?.(comment)
    }

    const loading = !commentId

    const commentType = isCommentProcessing
      ? 'processing'
      : comment && ['DELETED', 'MODERATED'].includes(comment.status)
      ? 'deleted'
      : comment && (video?.channel.ownerMember?.id === activeMemberId || comment?.author.id === activeMemberId)
      ? 'options'
      : 'default'

    const reactions =
      (comment &&
        getCommentReactions({
          userReactionsIds: userReactions,
          reactionsCount: comment?.reactionsCountByReactionId,
          activeMemberId,
          processingReactionId,
          disabled: isTransactionPendingSignature,
          deleted: commentType === 'deleted',
        })) ||
      undefined

    if (isEditingComment) {
      return (
        <CommentInput
          indented={!isReplyable}
          processing={editCommentInputIsProcessing}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          memberAvatarUrl={memberAvatarUrl}
          isMemberAvatarLoading={isMemberAvatarLoading}
          value={editCommentInputText}
          hasInitialValueChanged={comment?.text !== editCommentInputText}
          onFocus={handleOpenSignInDialog}
          onComment={() => handleUpdateComment()}
          onChange={(e) => setEditCommentInputText(e.target.value)}
          onCancel={() =>
            comment?.text !== editCommentInputText
              ? handleCancelConfirmation(handleCancelEditComment)
              : handleCancelEditComment()
          }
          initialFocus
        />
      )
    } else {
      return (
        <>
          <InternalComment
            indented={!!comment?.parentCommentId}
            isCommentFromUrl={commentId === commentIdQueryParam}
            videoId={video?.id}
            commentId={commentId}
            author={comment?.author}
            onToggleReplies={() => isReplyable && setRepliesOpen?.((value) => !value)}
            repliesOpen={isReplyable && isRepliesOpen}
            onReplyClick={isReplyable ? handleReplyClick : undefined}
            repliesCount={comment?.repliesCount}
            replyAvatars={[]} // for now there is no way to know who left a reply without actually opening replies, in the future QN may add support for this
            loading={loading}
            createdAt={comment?.createdAt ? new Date(comment.createdAt ?? '') : undefined}
            text={comment?.text}
            reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
            isAbleToEdit={comment?.author.id === activeMemberId}
            isModerated={comment?.status === CommentStatus.Moderated}
            memberHandle={comment?.author.handle}
            isEdited={comment?.isEdited}
            reactions={reactions}
            memberUrl={comment ? absoluteRoutes.viewer.member(comment.author.handle) : undefined}
            type={commentType}
            onEditClick={handleOnEditClick}
            onDeleteClick={() => video && comment && handleDeleteComment(comment)}
            onEditedLabelClick={handleOnEditLabelClick}
            onReactionClick={(reactionId) => comment && handleCommentReaction(comment.id, reactionId)}
            {...rest}
          />
          {isReplyable && replyInputOpen && (
            <CommentInput
              ref={replyCommentInputRef}
              memberAvatarUrl={memberAvatarUrl}
              isMemberAvatarLoading={isMemberAvatarLoading}
              processing={replyCommentInputIsProcessing}
              readOnly={!activeMemberId}
              memberHandle={activeMembership?.handle}
              onFocus={handleOpenSignInDialog}
              onComment={handleComment}
              hasInitialValueChanged={!!replyCommentInputText}
              value={replyCommentInputText}
              isInput
              onChange={(event) => setReplyCommentInputText(event.target.value)}
              indented
              onCancel={() => {
                replyCommentInputText ? handleCancelConfirmation(handleCancelReply, false) : handleCancelReply()
              }}
              initialFocus
              reply
            />
          )}
          <DialogModal
            size="medium"
            title="Edit history"
            show={showEditHistory}
            onExitClick={() => setShowEditHistory(false)}
            dividers
          >
            <CommentEditHistory originalComment={originalComment} />
          </DialogModal>
        </>
      )
    }
  }
)
Comment.displayName = 'Comment'
