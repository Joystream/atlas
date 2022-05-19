import React, { useState } from 'react'

import { useComment } from '@/api/hooks'
import {
  CommentFieldsFragment,
  CommentReactionsCountByReactionIdFieldsFragment,
  CommentStatus,
  VideoFieldsFragment,
} from '@/api/queries'
import { REACTION_TYPE, ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user'

import { InternalComment } from './InternalComment'

import { CommentInput } from '../CommentInput'
import { CommentRowProps } from '../CommentRow'
import { ReactionChipProps } from '../ReactionChip'

export type CommentProps = {
  commentId?: string
  video?: VideoFieldsFragment | null
  setOriginalComment?: React.Dispatch<React.SetStateAction<CommentFieldsFragment | null>>
  setShowEditHistory?: React.Dispatch<React.SetStateAction<boolean>>
  setHighlightedCommentId?: React.Dispatch<React.SetStateAction<string | null>>
} & CommentRowProps
export const Comment: React.FC<CommentProps> = React.memo(
  ({ commentId, video, setOriginalComment, setShowEditHistory, setHighlightedCommentId, ...rest }) => {
    const [commentInputIsProcessing, setCommentInputIsProcessing] = useState(false)
    const [isEditingComment, setIsEditingComment] = useState(false)
    const [commentInputText, setCommentInputText] = useState('')
    const [processingCommentReactionId, setProcessingCommentReactionId] = useState<string | null>(null)

    const { comment, loading } = useComment(commentId ?? '', { skip: !commentId })
    const { activeMemberId, activeMembership, activeAccountId, signIn } = useUser()
    const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
    const { openSignInDialog } = useDisplaySignInDialog()
    const [openModal, closeModal] = useConfirmationModal()
    const { reactToComment, deleteComment, moderateComment, updateComment } = useReactionTransactions()

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
    const handleEditCommentCancel = () => {
      if (comment?.text !== commentInputText) {
        openModal({
          title: 'Discard changes?',
          description: 'Are you sure you want to discard your comment changes?',
          type: 'warning',
          primaryButton: {
            text: 'Confirm and discard',
            onClick: () => {
              closeModal()
              setIsEditingComment(false)
              setCommentInputText('')
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
      } else {
        setIsEditingComment(false)
        setCommentInputText('')
      }
    }
    const handleUpdateComment = async () => {
      if (!video?.id || !commentInputText || !comment) {
        return
      }

      setCommentInputIsProcessing(true)
      const success = await updateComment({
        videoId: video.id,
        commentBody: commentInputText ?? '',
        commentId: comment.id,
      })
      setCommentInputIsProcessing(false)

      if (success) {
        setCommentInputText('')
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

    if (isEditingComment) {
      return (
        <CommentInput
          processing={commentInputIsProcessing}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          value={commentInputText}
          hasInitialValueChanged={comment?.text !== commentInputText}
          withoutOutlineBox
          onFocus={() => !activeMemberId && openSignInDialog({ onConfirm: signIn })}
          onComment={() => handleUpdateComment()}
          onChange={(e) => setCommentInputText(e.target.value)}
          onCancel={() => handleEditCommentCancel()}
        />
      )
    } else {
      return (
        <InternalComment
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
              : comment && (video?.channel.ownerMember?.id === activeMemberId || comment?.author.id === activeMemberId)
              ? 'options'
              : 'default'
          }
          onEditClick={() => {
            if (comment) {
              setIsEditingComment(true)
              setCommentInputText?.(comment.text)
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
      )
    }
  }
)
Comment.displayName = 'Comment'

type GetCommentReactionsArgs = {
  commentId: string
  userReactions?: number[]
  reactionsCount: CommentReactionsCountByReactionIdFieldsFragment[]
  activeMemberId: string | null
  processingCommentReactionId: string | null | undefined
}
const getCommentReactions = ({
  commentId,
  userReactions,
  reactionsCount,
  processingCommentReactionId,
}: GetCommentReactionsArgs): ReactionChipProps[] => {
  const defaultReactions: ReactionChipProps[] = Object.keys(REACTION_TYPE).map((reactionId) => ({
    reactionId: Number(reactionId) as ReactionId,
    customId: `${commentId}-${reactionId}`,
    state: 'processing' as const,
    count: 0,
  }))

  return defaultReactions.map((reaction) => {
    return {
      ...reaction,
      state: processingCommentReactionId === reaction.customId ? 'processing' : 'default',
      count: reactionsCount.find((r) => r.reactionId === reaction.reactionId)?.count || 0,
      active: !!userReactions?.find((r) => r === reaction.reactionId),
    }
  })
}
