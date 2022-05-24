import React, { useRef, useState } from 'react'

import { useComment } from '@/api/hooks'
import { CommentFieldsFragment, CommentStatus, VideoFieldsFragment } from '@/api/queries'
import { ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user'

import { InternalComment } from './InternalComment'
import { getCommentReactions } from './utils'

import { CommentInput } from '../CommentInput'
import { CommentRowProps } from '../CommentRow'

export type CommentProps = {
  commentId?: string
  video?: VideoFieldsFragment | null
  isReplyable?: boolean
  setOriginalComment?: React.Dispatch<React.SetStateAction<CommentFieldsFragment | null>>
  setShowEditHistory?: React.Dispatch<React.SetStateAction<boolean>>
  setHighlightedCommentId?: React.Dispatch<React.SetStateAction<string | null>>
  setRepliesOpen?: React.Dispatch<React.SetStateAction<boolean>>
  isRepliesOpen?: boolean
} & Exclude<CommentRowProps, 'memberAvatarUrl' | 'isMemberAvatarLoading'>

// TODO: comment replies don't return an ID on handleComment; investigate
export const Comment: React.FC<CommentProps> = React.memo(
  ({
    commentId,
    video,
    setOriginalComment,
    setShowEditHistory,
    setHighlightedCommentId,
    setRepliesOpen,
    isRepliesOpen,
    isReplyable,
    ...rest
  }) => {
    const replyCommentInputRef = useRef<HTMLTextAreaElement>(null)
    const [replyInputOpen, setReplyInputOpen] = useState(false)
    const [editCommentInputIsProcessing, setEditCommentInputIsProcessing] = useState(false)
    const [replyCommentInputIsProcessing, setReplyCommentInputIsProcessing] = useState(false)
    const [editCommentInputText, setEditCommentInputText] = useState('')
    const [replyCommentInputText, setReplyCommentInputText] = useState('')
    const [isEditingComment, setIsEditingComment] = useState(false)
    const [processingCommentReactionId, setProcessingCommentReactionId] = useState<string | null>(null)

    const { comment, loading } = useComment(commentId ?? '', { skip: !commentId })
    const { activeMemberId, activeMembership, activeAccountId, signIn } = useUser()
    const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)

    const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
    const { openSignInDialog } = useDisplaySignInDialog()
    const [openModal, closeModal] = useConfirmationModal()
    const { reactToComment, deleteComment, moderateComment, updateComment, addComment } = useReactionTransactions()

    const authorized = activeMemberId && activeAccountId

    const hadleDeleteComment = (comment: CommentFieldsFragment) => {
      const isChannelOwner = video?.channel.ownerMember?.id === activeMemberId && comment.author.id !== activeMemberId
      openModal({
        type: 'destructive',
        title: 'Delete this comment?',
        description: 'Are you sure you want to delete this comment? This cannot be undone.',
        primaryButton: {
          text: 'Delete comment',
          onClick: () => {
            isChannelOwner
              ? moderateComment(comment.id, video?.channel.id, comment.author.handle, video.title || '')
              : deleteComment(comment.id, video?.title || '')
            closeModal()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeModal(),
        },
      })
    }

    const handleCancelConfirmation = (cb: () => void) => {
      openModal({
        type: 'warning',
        title: 'Discard changes',
        description: 'Are you sure you want to discard your comment changes?',
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
        setProcessingCommentReactionId(commentId + `-` + reactionId.toString())
        await reactToComment(commentId, reactionId)
        setProcessingCommentReactionId(null)
      } else {
        openSignInDialog({ onConfirm: signIn })
      }
    }
    const handleComment = async (parentCommentId?: string) => {
      if (!video || !replyCommentInputText) {
        return
      }

      setReplyCommentInputIsProcessing(true)
      const commentId = await addComment({
        videoId: video.id,
        commentBody: replyCommentInputText,
        parentCommentId,
      })
      setReplyCommentInputIsProcessing(false)

      if (commentId) {
        setReplyCommentInputText('')
        setHighlightedCommentId?.(commentId || null)
        setReplyInputOpen(false)
      }
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

    const handleOpenSignInDialog = () => !activeMemberId && openSignInDialog({ onConfirm: signIn })

    const replyAvatars = comment?.replies?.map((comment) => ({
      url:
        comment?.author.metadata.avatar?.__typename === 'AvatarUri' ? comment?.author.metadata.avatar?.avatarUri : '',
      handle: comment.author.handle,
    }))

    if (isEditingComment) {
      return (
        <CommentInput
          processing={editCommentInputIsProcessing}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          memberAvatarUrl={memberAvatarUrl}
          isMemberAvatarLoading={isMemberAvatarLoading}
          value={editCommentInputText}
          hasInitialValueChanged={comment?.text !== editCommentInputText}
          withoutOutlineBox
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
            author={comment?.author}
            onToggleReplies={() => isReplyable && setRepliesOpen?.((value) => !value)}
            repliesOpen={isReplyable && isRepliesOpen}
            onReplyClick={isReplyable ? handleReplyClick : undefined}
            replyAvatars={replyAvatars}
            repliesCount={comment?.repliesCount}
            repliesLoading={!!comment?.repliesCount && !comment?.replies}
            loading={loading}
            createdAt={comment?.createdAt ? new Date(comment.createdAt ?? '') : undefined}
            text={comment?.text}
            reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
            isAbleToEdit={comment?.author.id === activeMemberId}
            isModerated={comment?.status === CommentStatus.Moderated}
            memberHandle={comment?.author.handle}
            isEdited={comment?.isEdited}
            reactions={
              comment &&
              getCommentReactions({
                commentId: comment?.id,
                userReactions: comment?.userReactions,
                reactionsCount: comment?.reactionsCountByReactionId,
                activeMemberId,
                processingCommentReactionId,
              })
            }
            memberUrl={comment ? absoluteRoutes.viewer.member(comment.author.handle) : undefined}
            memberAvatarUrl={
              comment?.author.metadata.avatar?.__typename === 'AvatarUri'
                ? comment.author.metadata.avatar?.avatarUri
                : undefined
            }
            type={
              comment && ['DELETED', 'MODERATED'].includes(comment.status)
                ? 'deleted'
                : comment &&
                  (video?.channel.ownerMember?.id === activeMemberId || comment?.author.id === activeMemberId)
                ? 'options'
                : 'default'
            }
            onEditClick={() => {
              if (comment) {
                setIsEditingComment(true)
                setEditCommentInputText?.(comment.text)
              }
            }}
            onDeleteClick={() => video && comment && hadleDeleteComment(comment)}
            onEditedLabelClick={() => {
              setShowEditHistory?.(true)
              comment && setOriginalComment?.(comment)
            }}
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
              onComment={() => handleComment(comment?.id)}
              hasInitialValueChanged={!!replyCommentInputText}
              value={replyCommentInputText}
              withoutOutlineBox
              onChange={(event) => setReplyCommentInputText(event.target.value)}
              indented
              onCancel={() => {
                editCommentInputText ? handleCancelConfirmation(handleCancelReply) : handleCancelReply()
              }}
              initialFocus
              reply
            />
          )}
        </>
      )
    }
  }
)
Comment.displayName = 'Comment'
