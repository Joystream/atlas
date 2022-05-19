import React, { useEffect, useState } from 'react'
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
import { useUser } from '@/providers/user'

import { CommentThread } from './CommentThread'
import { CommentWrapper, CommentsSectionHeader, CommentsSectionWrapper } from './VideoView.styles'
import { getCommentReactions } from './utils'

type CommentsSectionProps = {
  disabled?: boolean
  video?: VideoFieldsFragment | null
  videoLoading: boolean
  videoAuthorId?: string
}

const SCROLL_TO_COMMENT_TIMEOUT = 300

export const CommentsSection: React.FC<CommentsSectionProps> = ({ disabled, video, videoAuthorId, videoLoading }) => {
  const [sortCommentsBy, setSortCommentsBy] = useState(COMMENTS_SORT_OPTIONS[0].value)
  const { id: videoId } = useParams()
  const { activeMemberId, activeAccountId, signIn, activeMembership } = useUser()
  const { openSignInDialog } = useDisplaySignInDialog()
  const { isLoadingAsset: isMemberAvatarLoading, url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const [commentInputText, setCommentInputText] = useState('')
  const [commentInputIsProcessing, setCommentInputIsProcessing] = useState(false)
  const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
  const [showEditHistory, setShowEditHistory] = useState(false)
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null)
  const commentIdQueryParam = useRouterQuery(QUERY_PARAMS.COMMENT_ID)

  const authorized = activeMemberId && activeAccountId
  const commentWrapperRef = useRef<HTMLDivElement>(null)
  const { comments, totalCount, loading } = useCommentSectionComments(
    {
      memberId: activeMemberId,
      videoId: videoId,
    },
    { skip: disabled || !videoId }
  )

  const { addComment } = useReactionTransactions()

  const { comment: commentFromUrl, loading: commentFromUrlLoading } = useComment(
    commentIdQueryParam || '',

    {
      skip: !commentIdQueryParam || (comments && comments.length === 1),
    }
  )
  const { comment: parentCommentFromUrl, loading: parentCommentFromUrlLoading } = useComment(
    commentFromUrl?.parentCommentId || '',
    {
      skip: !commentFromUrl || !commentFromUrl.parentCommentId,
    }
  )
  const commentsLoading = loading || commentFromUrlLoading || parentCommentFromUrlLoading || videoLoading

  const scrollToCommentInput = (smooth?: boolean) => {
    commentWrapperRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  const mdMatch = useMediaMatch('md')

  const handleSorting = (value?: CommentOrderByInput[] | null) => {
    if (value) {
      setSortCommentsBy(value)
    }
  }

  const handleComment = async (parentCommentId?: string) => {
    if (!videoId || !commentInputText) {
      return
    }
    setCommentInputIsProcessing(true)
    const newCommentId = await addComment({
      videoId,
      commentBody: commentInputText,
      parentCommentId,
    })
    setCommentInputIsProcessing(false)
    if (newCommentId) {
      setCommentInputText('')
      setHighlightedCommentId(newCommentId || null)
    }
  }

  const placeholderItems = commentsLoading ? Array.from({ length: 4 }, () => ({ id: undefined })) : []

  useEffect(() => {
    if (!commentIdQueryParam || !commentWrapperRef.current) {
      return
    }
    const scrollTimeout = setTimeout(() => {
      scrollToCommentInput(true)
      setHighlightedCommentId(commentIdQueryParam)
    }, SCROLL_TO_COMMENT_TIMEOUT)

    return () => {
      clearTimeout(scrollTimeout)
    }
  }, [commentIdQueryParam])

  useEffect(
    function resetHighlightedComment() {
      if (!highlightedCommentId || commentsLoading) {
        return
      }
      const timeout = setTimeout(() => {
        setHighlightedCommentId(null)
      }, 3000)

      return () => clearTimeout(timeout)
    },
    [commentsLoading, highlightedCommentId, setHighlightedCommentId]
  )

  // remove highlighted reply taken from url
  const filteredParentCommentReplies = parentCommentFromUrl
    ? {
        ...parentCommentFromUrl,
        replies: parentCommentFromUrl?.replies?.filter((comment) => comment.id !== commentIdQueryParam) || [],
      }
    : null

  // remove comment taken from url from regular array of comments
  const filteredCommentsFromCommentUrl =
    comments?.filter(
      (comment) => commentFromUrl && ![commentFromUrl.id, commentFromUrl.parentCommentId].includes(comment.id)
    ) || []

  // if comment from url is reply, merge it with parent comment, if not render only parent
  const preparedHighlightedComment = commentFromUrl
    ? commentFromUrl?.parentCommentId
      ? filteredParentCommentReplies
        ? [filteredParentCommentReplies, commentFromUrl]
        : []
      : [commentFromUrl]
    : []

  const filteredComments = commentFromUrl
    ? [...preparedHighlightedComment, ...filteredCommentsFromCommentUrl]
    : comments

  if (disabled) {
    return (
      <CommentsSectionWrapper>
        <EmptyFallback title="Comments are disabled" subtitle="Author has disabled comments for this video" />
      </CommentsSectionWrapper>
    )
  }
  return (
    <CommentsSectionWrapper>
      <CommentsSectionHeader ref={commentWrapperRef}>
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
        processing={commentInputIsProcessing}
        readOnly={!activeMemberId}
        memberHandle={activeMembership?.handle}
        value={commentInputText}
        hasInitialValueChanged={!!commentInputText}
        withoutOutlineBox
        onFocus={() => !activeMemberId && openSignInDialog({ onConfirm: signIn })}
        onComment={() => handleComment()}
        onChange={(e) => setCommentInputText(e.target.value)}
      />
      {comments && !comments.length && (
        <EmptyFallback title="Be the first to comment" subtitle="Nobody has left a comment under this video yet." />
      )}
      <CommentWrapper>
        {commentsLoading
          ? placeholderItems.map((_, idx) => <Comment key={idx} />)
          : filteredComments?.map((comment, idx) => (
              <Comment
                key={`${comment.id}-${idx}`}
                commentId={comment.id}
                video={video}
                setOriginalComment={setOriginalComment}
                setHighlightedCommentId={setHighlightedCommentId}
                highlighted={highlightedCommentId === comment.id}
              />
              //   <CommentThread
              //   key={`${comment.id}-${idx}`}
              // indented={!!comment.parentCommentId && comment.id === commentIdQueryParam}
              //   author={comment.author}
              //   idx={idx}
              //   highlighted={comment.id === highlightedComment}
              //   onCommentReaction={handleCommentReaction}
              //   reactions={getCommentReactions({
              //     commentId: comment.id,
              //     userReactions: comment.userReactions,
              //     reactionsCount: comment.reactionsCountByReactionId,
              //     activeMemberId,
              //     processingCommentReactionId,
              //   })}
              //   authorized={!!authorized}
              //   onDeleteClick={() => video && handleDeleteComment(comment, video)}
              //   loading={!comment.id}
              //   commentId={comment.id}
              //   onOpenSignInDialog={handleOpenSignInDialog}
              //   createdAt={new Date(comment.createdAt)}
              //   text={comment.text}
              //   reactionPopoverDismissed={reactionPopoverDismissed || !authorized}
              //   isEdited={comment.isEdited}
              //   isAbleToEdit={comment.author.id === activeMemberId}
              //   isModerated={comment.status === CommentStatus.Moderated}
              //   memberHandle={comment.author.handle}
              //   memberUrl={absoluteRoutes.viewer.member(comment.author.handle)}
              //   videoAuthorId={videoAuthorId}
              //   type={
              //     ['DELETED', 'MODERATED'].includes(comment.status)
              //       ? 'deleted'
              //       : video?.channel.ownerMember?.id === activeMemberId || comment.author.id === activeMemberId
              //       ? 'options'
              //       : 'default'
              //   }
              //   videoId={videoId}
              //   processingCommentReactionId={processingCommentReactionId}
              //   replies={comment.replies}
              //   repliesCount={comment.repliesCount}
              //   repliesLoading={!!comment.repliesCount && !comment.replies}
              //   onReactionClick={(reactionId) => handleCommentReaction(comment.id, reactionId)}
              //   onEditLabelClick={(replyComment) => {
              //     setShowEditHistory(true)
              //     setOriginalComment(replyComment || comment)
              //   }}
              //   onEditClick={() => {
              //     setIsEditingComment({ commentId: comment.id, value: true })
              //     setCommentInputText({ commentId: comment.id, comment: comment.text })
              //   }}
              //   channelOwnerMember={video?.channel.ownerMember?.id}
              //   onUpdateComment={handleUpdateComment}
              //   onEditCommentCancel={handleEditCommentCancel}
              //   onSetIsEditingComment={setIsEditingComment}
              //   onSetCommentInputText={setCommentInputText}
              //   isEditingCommentCollection={isEditingCommentCollection}
              //   commentInputTextCollection={commentInputTextCollection}
              //   onReplyDeleteClick={(replyComment) => video && handleDeleteComment(replyComment, video)}
              // />
            ))}
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
