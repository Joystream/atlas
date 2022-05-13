import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCommentsConnection } from '@/api/hooks'
import {
  CommentFieldsFragment,
  CommentOrderByInput,
  CommentReactionFieldsFragment,
  CommentReactionsCountByReactionIdFieldsFragment,
  CommentStatus,
  VideoFieldsFragment,
} from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Text } from '@/components/Text'
import { Comment } from '@/components/_comments/Comment'
import { CommentEditHistory } from '@/components/_comments/CommentEditHistory'
import { CommentInput } from '@/components/_comments/CommentInput'
import { ReactionChipProps } from '@/components/_comments/ReactionChip'
import { Select } from '@/components/_inputs/Select'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { REACTION_TYPE, ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'
import { COMMENTS_SORT_OPTIONS } from '@/config/sorting'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useMemberAvatar } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user'

import { CommentWrapper, CommentsSectionHeader, CommentsSectionWrapper } from './VideoView.styles'

type CommentsSectionProps = {
  disabled?: boolean
  video?: VideoFieldsFragment | null
}

type GetCommentReactionsArgs = {
  commentId: string
  reactions: CommentReactionFieldsFragment[]
  reactionsCount: CommentReactionsCountByReactionIdFieldsFragment[]
  activeMemberId: string | null
  processingCommentReactionId: string | null
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ disabled, video }) => {
  const [sortCommentsBy, setSortCommentsBy] = useState(CommentOrderByInput.ReactionsCountDesc)
  const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
  const [showEditHistory, setShowEditHistory] = useState(false)
  const [openDeleteModal, closeDeleteModal] = useConfirmationModal()
  const [commentBody, setCommentBody] = useState('')
  const { id } = useParams()
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
  const { activeMemberId, activeAccountId, signIn, activeMembership } = useUser()
  const { openSignInDialog } = useDisplaySignInDialog()
  const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)

  useEffect(() => {
    if (!highlightedComment) {
      return
    }
    const timeout = setTimeout(() => {
      setHighlightedComment(null)
    }, 3000)

    return () => clearTimeout(timeout)
  })

  const authorized = activeMemberId && activeAccountId

  const { comments, totalCount, loading } = useCommentsConnection(
    {
      where: { video: { id_eq: id }, OR: [{ status_eq: CommentStatus.Visible }, { repliesCount_gt: 0 }] },
      orderBy: sortCommentsBy,
    },
    { skip: disabled || !id }
  )

  const {
    processingCommentReactionId,
    reactToComment,
    addComment,
    commentInputProcessing,
    deleteComment,
    moderateComment,
  } = useReactionTransactions()

  const mdMatch = useMediaMatch('md')
  const placeholderItems = loading && !comments ? Array.from({ length: 4 }, () => ({ id: undefined })) : []

  const handleSorting = (value?: CommentOrderByInput | null) => {
    if (value) {
      setSortCommentsBy(value)
    }
  }

  const handleComment = useCallback(
    async (videoId?: string, commentBody?: string, parentCommentId?: string) => {
      if (!videoId || !commentBody) {
        return
      }
      const commentId = await addComment(videoId, commentBody, parentCommentId)
      setCommentBody('')
      setHighlightedComment(commentId || null)
    },
    [addComment]
  )

  const handleCommentReaction = useCallback(
    (commentId: string, reactionId: ReactionId) => {
      if (authorized) {
        reactToComment(commentId, reactionId)
      } else {
        openSignInDialog({ onConfirm: signIn })
      }
    },
    [authorized, openSignInDialog, reactToComment, signIn]
  )

  const hadleDeleteComment = useCallback(
    (comment: CommentFieldsFragment, video: VideoFieldsFragment) => {
      const isChannelOwner = video?.channel.ownerMember?.id === activeMemberId && comment.author.id !== activeMemberId
      openDeleteModal({
        type: 'destructive',
        title: 'Delete this comment?',
        description: 'Are you sure you want to delete this comment? This cannot be undone.',
        primaryButton: {
          text: 'Delete comment',
          onClick: () => {
            isChannelOwner
              ? moderateComment(comment.id, video?.channel.id, comment.author.handle, video.title || '')
              : deleteComment(comment.id, video?.title || '')
            closeDeleteModal()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeDeleteModal(),
        },
      })
    },
    [activeMemberId, closeDeleteModal, deleteComment, moderateComment, openDeleteModal]
  )

  const getCommentReactions = useCallback(
    ({ commentId, reactions, reactionsCount }: GetCommentReactionsArgs): ReactionChipProps[] => {
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
          active: reactions.some((r) => r.reactionId === reaction.reactionId && r.member.id === activeMemberId),
        }
      })
    },
    [processingCommentReactionId, activeMemberId]
  )
  const memoizedComments = useMemo(() => {
    return comments?.map((comment, idx) => {
      return (
        <Comment
          key={`${comment.id}-${idx}`}
          highlighted={comment.id === highlightedComment}
          reactions={getCommentReactions({
            commentId: comment.id,
            reactions: comment.reactions,
            reactionsCount: comment.reactionsCountByReactionId,
            activeMemberId,
            processingCommentReactionId,
          })}
          onDeleteClick={() => video && hadleDeleteComment(comment, video)}
          onEditLabelClick={() => {
            setShowEditHistory(true)
            setOriginalComment(comment)
          }}
          loading={!comment.id}
          createdAt={new Date(comment.createdAt)}
          text={comment.text}
          reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
          isEdited={comment.isEdited}
          onReactionClick={(reactionId) => handleCommentReaction(comment.id, reactionId)}
          isAbleToEdit={comment.author.id === activeMemberId}
          moderatedBy={comment.moderatedInEvent?.videoChannel.title}
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
      )
    })
  }, [
    comments,
    highlightedComment,
    getCommentReactions,
    activeMemberId,
    processingCommentReactionId,
    reactionPopoverDismissed,
    authorized,
    video,
    hadleDeleteComment,
    handleCommentReaction,
  ])

  if (disabled) {
    return (
      <CommentsSectionWrapper>
        <EmptyFallback title="Comments are disabled" subtitle="Author has disabled comments for this video" />
      </CommentsSectionWrapper>
    )
  }

  return (
    <CommentsSectionWrapper>
      <CommentsSectionHeader>
        <Text variant="h400">{loading || !totalCount ? 'Comments' : `${totalCount} comments`}</Text>
        <Select
          size="small"
          labelPosition="left"
          label={mdMatch ? 'Sort by' : ''}
          value={sortCommentsBy}
          items={COMMENTS_SORT_OPTIONS}
          onChange={handleSorting}
          disabled={loading}
        />
      </CommentsSectionHeader>
      <CommentInput
        memberAvatarUrl={memberAvatarUrl}
        isMemberAvatarLoading={authorized ? isMemberAvatarLoading : false}
        processing={commentInputProcessing}
        readOnly={!activeMemberId}
        memberHandle={activeMembership?.handle}
        onFocus={() => !activeMemberId && openSignInDialog({ onConfirm: signIn })}
        onComment={() => handleComment(id, commentBody)}
        value={commentBody}
        withoutOutlineBox
        onChange={(e) => setCommentBody(e.currentTarget.value)}
      />
      {comments && !comments.length && (
        <EmptyFallback title="Be the first to comment" subtitle="Nobody has left a comment under this video yet." />
      )}
      <CommentWrapper>
        {loading ? placeholderItems.map((_, idx) => <Comment key={idx} type="default" loading />) : memoizedComments}
      </CommentWrapper>
      <DialogModal
        size="medium"
        title="Edit history"
        show={showEditHistory}
        onExitClick={() => setShowEditHistory(false)}
        dividers
      >
        <CommentEditHistory originalComment={originalComment} />
      </DialogModal>
    </CommentsSectionWrapper>
  )
}
