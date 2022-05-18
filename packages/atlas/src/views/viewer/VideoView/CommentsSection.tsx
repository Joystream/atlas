import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCommentSectionComments } from '@/api/hooks'
import {
  CommentFieldsFragment,
  CommentOrderByInput,
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
  userReactions?: number[]
  reactionsCount: CommentReactionsCountByReactionIdFieldsFragment[]
  activeMemberId: string | null
  processingCommentReactionId: string | null
}
const COMMENT_BOX_ID = 'comment-box'

export const CommentsSection: React.FC<CommentsSectionProps> = ({ disabled, video }) => {
  const [sortCommentsBy, setSortCommentsBy] = useState(COMMENTS_SORT_OPTIONS[0].value)
  const [openModal, closeModal] = useConfirmationModal()
  const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
  const [showEditHistory, setShowEditHistory] = useState(false)
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
  const { activeMemberId, activeAccountId, signIn, activeMembership } = useUser()
  const { openSignInDialog } = useDisplaySignInDialog()
  const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)
  const { id: videoId } = useParams()
  // indexed by commentId's
  const [commentInputTextCollection, setCommentInputTextCollection] = useState(new Map<string, string>())
  // indexed by commentId's
  const [isEditingCommentCollection, setIsEditingCommentCollection] = useState(new Set<string>())

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

  const { comments, totalCount, loading } = useCommentSectionComments(
    {
      memberId: activeMemberId,
      videoId: videoId,
    },
    { skip: disabled || !videoId }
  )

  const {
    processingCommentReactionId,
    reactToComment,
    addComment,
    commentInputIsProcessingCollection,
    deleteComment,
    moderateComment,
    updateComment,
  } = useReactionTransactions()

  const mdMatch = useMediaMatch('md')

  const setCommentInputText = ({ commentId, comment }: { commentId: string; comment: string | undefined }) =>
    setCommentInputTextCollection((commentInputTextCollection) => {
      if (comment !== undefined) {
        commentInputTextCollection.set(commentId, comment)
      } else {
        commentInputTextCollection.delete(commentId)
      }
      return new Map(commentInputTextCollection)
    })

  const handleSorting = (value?: CommentOrderByInput[] | null) => {
    if (value) {
      setSortCommentsBy(value)
    }
  }

  const handleComment = async ({
    commentInputId,
    parentCommentId,
  }: {
    commentInputId: string
    parentCommentId?: string
  }) => {
    if (!videoId || !commentInputTextCollection.get(commentInputId)) {
      return
    }
    const commentId = await addComment({
      videoId,
      commentBody: commentInputTextCollection.get(commentInputId) ?? '',
      parentCommentId,
      commentId: commentInputId,
    })
    setCommentInputText({ commentId: commentInputId, comment: '' })
    setHighlightedComment(commentId || null)
  }

  // removes highlightedComment effect after timeout passes
  useEffect(() => {
    if (!highlightedComment) {
      return
    }
    const timeout = setTimeout(() => {
      setHighlightedComment(null)
    }, 3000)
    return () => clearTimeout(timeout)
  })

  const placeholderItems = loading && !comments ? Array.from({ length: 4 }, () => ({ id: undefined })) : []

  const memoizedComments = useMemo(() => {
    const setIsEditingComment = ({ commentId, value }: { commentId: string; value: boolean }) => {
      setIsEditingCommentCollection((isEditing) => {
        if (value) {
          isEditing.add(commentId)
        } else {
          isEditing.delete(commentId)
        }
        return new Set(isEditing)
      })
    }
    const getCommentReactions = ({
      commentId,
      reactions,
      reactionsCount,
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
          active: reactions.some((r) => r.reactionId === reaction.reactionId && r.member.id === activeMemberId),
        }
      })
    }
    const handleUpdateComment = async ({ commentId }: { commentId: string }) => {
      if (!videoId || !commentInputTextCollection.get(commentId)) {
        return
      }
      await updateComment({
        videoId,
        commentBody: commentInputTextCollection.get(commentId) ?? '',
        commentId: commentId,
      })
      setCommentInputText({ commentId, comment: undefined })
      setHighlightedComment(commentId || null)
      setIsEditingComment({ commentId, value: false })
    }
    const handleCommentReaction = (commentId: string, reactionId: ReactionId) => {
      if (authorized) {
        reactToComment(commentId, reactionId)
      } else {
        openSignInDialog({ onConfirm: signIn })
      }
    }
    const hadleDeleteComment = (comment: CommentFieldsFragment, video: VideoFieldsFragment) => {
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
    const handleEditCommentCancel = (comment: CommentFieldsFragment) => {
      if (comment.text !== commentInputTextCollection.get(comment.id)) {
        openModal({
          title: 'Discard changes?',
          description: 'Are you sure you want to discard your comment changes?',
          type: 'warning',
          primaryButton: {
            text: 'Confirm and discard',
            onClick: () => {
              closeModal()
              setIsEditingComment({ commentId: comment.id, value: false })
              setCommentInputText({ commentId: comment.id, comment: undefined })
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
        setIsEditingComment({ commentId: comment.id, value: false })
        setCommentInputText({ commentId: comment.id, comment: undefined })
      }
    }

    return comments?.map((comment, idx) =>
      isEditingCommentCollection.has(comment.id) ? (
        <CommentInput
          key={`${comment.id}-${idx}`}
          processing={commentInputIsProcessingCollection.has(comment.id)}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          onFocus={() => !activeMemberId && openSignInDialog({ onConfirm: signIn })}
          onComment={() => handleUpdateComment({ commentId: comment.id })}
          value={commentInputTextCollection.get(comment.id) ?? ''}
          hasInitialValueChanged={comment.text !== commentInputTextCollection.get(comment.id)}
          onChange={(value) => setCommentInputText({ commentId: comment.id, comment: value })}
          onCancel={() => handleEditCommentCancel(comment)}
          withoutOutlineBox
        />
      ) : (
        <Comment
          key={`${comment.id}-${idx}`}
          highlighted={comment.id === highlightedComment}
          reactions={getCommentReactions({
            commentId: comment.id,
            userReactions: comment.userReactions,
            reactionsCount: comment.reactionsCountByReactionId,
            activeMemberId,
            processingCommentReactionId,
          })}
          loading={!comment.id}
          createdAt={new Date(comment.createdAt)}
          text={comment.text}
          reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
          isEdited={comment.isEdited}
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
          onReactionClick={(reactionId) => handleCommentReaction(comment.id, reactionId)}
          onDeleteClick={() => video && hadleDeleteComment(comment, video)}
          onEditLabelClick={() => {
            setShowEditHistory(true)
            setOriginalComment(comment)
          }}
          onEditClick={() => {
            setIsEditingComment({ commentId: comment.id, value: true })
            setCommentInputText({ commentId: comment.id, comment: comment.text })
          }}
        />
      )
    )
  }, [
    comments,
    videoId,
    commentInputTextCollection,
    updateComment,
    authorized,
    reactToComment,
    openSignInDialog,
    signIn,
    activeMemberId,
    openModal,
    moderateComment,
    deleteComment,
    closeModal,
    isEditingCommentCollection,
    commentInputIsProcessingCollection,
    activeMembership?.handle,
    highlightedComment,
    processingCommentReactionId,
    reactionPopoverDismissed,
    video,
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
        processing={commentInputIsProcessingCollection.has(COMMENT_BOX_ID)}
        readOnly={!activeMemberId}
        memberHandle={activeMembership?.handle}
        onFocus={() => !activeMemberId && openSignInDialog({ onConfirm: signIn })}
        onComment={() => handleComment({ commentInputId: COMMENT_BOX_ID })}
        value={commentInputTextCollection.get(COMMENT_BOX_ID) ?? ''}
        hasInitialValueChanged={!!commentInputTextCollection.get(COMMENT_BOX_ID)}
        withoutOutlineBox
        onChange={(value) => setCommentInputText({ commentId: COMMENT_BOX_ID, comment: value })}
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
