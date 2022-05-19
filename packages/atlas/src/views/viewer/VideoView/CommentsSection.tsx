import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useComment, useCommentSectionComments } from '@/api/hooks'
import { CommentFieldsFragment, CommentOrderByInput, CommentStatus, VideoFieldsFragment } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Text } from '@/components/Text'
import { Comment } from '@/components/_comments/Comment'
import { CommentEditHistory } from '@/components/_comments/CommentEditHistory'
import { CommentInput } from '@/components/_comments/CommentInput'
import { Select } from '@/components/_inputs/Select'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { ReactionId } from '@/config/reactions'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { COMMENTS_SORT_OPTIONS } from '@/config/sorting'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useMemberAvatar } from '@/providers/assets'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user'

import { CommentThread } from './CommentThread'
import { CommentWrapper, CommentsSectionHeader, CommentsSectionWrapper } from './VideoView.styles'
import { getCommentReactions } from './utils'

type CommentsSectionProps = {
  disabled?: boolean
  video?: VideoFieldsFragment | null
  videoAuthorId?: string
}

const SCROLL_TO_COMMENT_TIMEOUT = 300
const HIGHLIGHTED_COMMENT_TIMEOUT = 3000
const COMMENT_BOX_ID = 'comment-box'

export const CommentsSection: React.FC<CommentsSectionProps> = ({ disabled, video, videoAuthorId }) => {
  const [sortCommentsBy, setSortCommentsBy] = useState(COMMENTS_SORT_OPTIONS[0].value)
  const [openModal, closeModal] = useConfirmationModal()
  const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
  const [showEditHistory, setShowEditHistory] = useState(false)
  const { id } = useParams()
  const commentLink = useRouterQuery(QUERY_PARAMS.COMMENT_ID)
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
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const { comment: commentFromUrl } = useComment(commentLink || '', { skip: !commentLink })

  const scrollToCommentInput = (smooth?: boolean) => {
    commentRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  useEffect(() => {
    if (!commentLink || !commentRef.current) {
      return
    }
    const scrollTimeout = setTimeout(() => {
      scrollToCommentInput(true)
      setHighlightedComment(commentLink)
    }, SCROLL_TO_COMMENT_TIMEOUT)

    return () => {
      clearTimeout(scrollTimeout)
    }
  }, [commentLink])

  useEffect(() => {
    if (!highlightedComment) {
      return
    }
    const timeout = setTimeout(() => {
      setHighlightedComment(null)
    }, HIGHLIGHTED_COMMENT_TIMEOUT)

    return () => clearTimeout(timeout)
  })

  const authorized = activeMemberId && activeAccountId

  const { comments, totalCount, loading } = useCommentSectionComments(
    {
      memberId: activeMemberId,
      videoId: videoId,
      orderBy: sortCommentsBy,
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
    const newCommentId = await addComment({
      videoId,
      commentBody: commentInputTextCollection.get(commentInputId) ?? '',
      parentCommentId,
      commentInputId,
    })
    if (newCommentId) {
      setCommentInputText({ commentId: commentInputId, comment: undefined })
      setHighlightedComment(newCommentId || null)
    }
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

  const handleOpenSignInDialog = useCallback(() => {
    if (activeMemberId) {
      return
    }
    openSignInDialog({ onConfirm: signIn })
  }, [activeMemberId, openSignInDialog, signIn])

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
    const handleDeleteComment = (comment: CommentFieldsFragment, video: VideoFieldsFragment) => {
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

    const filteredComments = commentFromUrl
      ? comments?.filter((comment) => ![commentFromUrl.id, commentFromUrl.parentCommentId].includes(comment.id))
      : comments

    return filteredComments?.map((comment, idx) =>
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
          onChange={(e) => setCommentInputText({ commentId: comment.id, comment: e.target.value })}
          onCancel={() => handleEditCommentCancel(comment)}
          memberAvatarUrl={memberAvatarUrl}
          withoutOutlineBox
        />
      ) : (
        <CommentThread
          videoId={id}
          key={`${comment.id}-${idx}`}
          author={comment.author}
          idx={idx}
          highlighted={comment.id === highlightedComment}
          onCommentReaction={handleCommentReaction}
          reactions={getCommentReactions({
            commentId: comment.id,
            userReactions: comment.userReactions,
            reactionsCount: comment.reactionsCountByReactionId,
            activeMemberId,
            processingCommentReactionId,
          })}
          authorized={!!authorized}
          onDeleteClick={() => video && handleDeleteComment(comment, video)}
          loading={!comment.id}
          commentId={comment.id}
          onOpenSignInDialog={handleOpenSignInDialog}
          createdAt={new Date(comment.createdAt)}
          text={comment.text}
          reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
          isEdited={comment.isEdited}
          isAbleToEdit={comment.author.id === activeMemberId}
          isModerated={comment.status === CommentStatus.Moderated}
          memberHandle={comment.author.handle}
          memberUrl={absoluteRoutes.viewer.member(comment.author.handle)}
          videoAuthorId={videoAuthorId}
          memberAvatarUrl={
            comment.author.metadata.avatar?.__typename === 'AvatarUri'
              ? comment.author.metadata.avatar?.avatarUri
              : undefined
          }
          onTimeStampClick={scrollToCommentInput}
          type={
            ['DELETED', 'MODERATED'].includes(comment.status)
              ? 'deleted'
              : video?.channel.ownerMember?.id === activeMemberId || comment.author.id === activeMemberId
              ? 'options'
              : 'default'
          }
          processingCommentReactionId={processingCommentReactionId}
          replies={comment.replies}
          repliesCount={comment.repliesCount}
          repliesLoading={!!comment.repliesCount && !comment.replies}
          onReactionClick={(reactionId) => handleCommentReaction(comment.id, reactionId)}
          onEditLabelClick={(replyComment) => {
            setShowEditHistory(true)
            setOriginalComment(replyComment || comment)
          }}
          onEditClick={() => {
            setIsEditingComment({ commentId: comment.id, value: true })
            setCommentInputText({ commentId: comment.id, comment: comment.text })
          }}
          channelOwnerMember={video?.channel.ownerMember?.id}
          onUpdateComment={handleUpdateComment}
          onEditCommentCancel={handleEditCommentCancel}
          onSetIsEditingComment={setIsEditingComment}
          onSetCommentInputText={setCommentInputText}
          isEditingCommentCollection={isEditingCommentCollection}
          commentInputTextCollection={commentInputTextCollection}
          onReplyDeleteClick={(replyComment) => video && handleDeleteComment(replyComment, video)}
        />
      )
    )
  }, [
    commentFromUrl,
    comments,
    videoId,
    commentInputTextCollection,
    updateComment,
    activeMemberId,
    openModal,
    moderateComment,
    deleteComment,
    closeModal,
    isEditingCommentCollection,
    commentInputIsProcessingCollection,
    activeMembership?.handle,
    memberAvatarUrl,
    id,
    highlightedComment,
    handleCommentReaction,
    processingCommentReactionId,
    authorized,
    handleOpenSignInDialog,
    reactionPopoverDismissed,
    videoAuthorId,
    video,
    openSignInDialog,
    signIn,
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
        ref={commentLink ? commentRef : undefined}
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
        onChange={(e) => setCommentInputText({ commentId: COMMENT_BOX_ID, comment: e.target.value })}
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
