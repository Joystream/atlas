import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useComments } from '@/api/hooks'
import { CommentFieldsFragment, CommentOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Text } from '@/components/Text'
import { Comment } from '@/components/_comments/Comment'
import { CommentEditHistory } from '@/components/_comments/CommentEditHistory'
import { CommentInput } from '@/components/_comments/CommentInput'
import { Select } from '@/components/_inputs/Select'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { COMMENTS_SORT_OPTIONS } from '@/config/sorting'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

import { CommentWrapper, CommentsSectionHeader, CommentsSectionWrapper } from './VideoView.styles'

type CommentsSectionProps = {
  disabled?: boolean
  videoAuthorId?: string
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ disabled, videoAuthorId }) => {
  const [sortCommentsBy, setSortCommentsBy] = useState(CommentOrderByInput.ReactionsCountDesc)
  const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
  const [showEditHistory, setShowEditHistory] = useState(false)
  const { openSignInDialog } = useDisplaySignInDialog()
  const { id } = useParams()
  const { activeMemberId, signIn, activeMembership } = useUser()
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)
  const handleTransaction = useTransaction()
  const { joystream, proxyCallback } = useJoystream()
  const [commentBody, setCommentBody] = useState('')
  const [commentInputProcessing, setCommentInputProcessing] = useState(false)
  const { comments, loading, refetch } = useComments(
    { where: { video: { id_eq: id } }, orderBy: sortCommentsBy },
    { skip: disabled || !id }
  )
  const mdMatch = useMediaMatch('md')
  const placeholderItems = loading && !comments ? Array.from({ length: 4 }, () => ({ id: undefined })) : []

  const handleSorting = (value?: CommentOrderByInput | null) => {
    if (value) {
      setSortCommentsBy(value)
    }
  }

  useEffect(() => {
    if (!highlightedComment) {
      return
    }
    const timeout = setTimeout(() => {
      setHighlightedComment(null)
    }, 3000)

    return () => clearTimeout(timeout)
  })

  if (disabled) {
    return (
      <CommentsSectionWrapper>
        <EmptyFallback title="Comments are disabled" subtitle="Author has disabled comments for this video" />
      </CommentsSectionWrapper>
    )
  }

  const handleCreate = (parentCommentId?: string) => {
    if (!joystream || !activeMemberId || !id) {
      ConsoleLogger.error('no joystream or active member')
      return
    }

    handleTransaction({
      preProcess: () => {
        setCommentInputProcessing(true)
      },
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).createVideoComment(
          activeMemberId,
          id,
          commentBody,
          parentCommentId || null,
          proxyCallback(updateStatus)
        ),
      onTxSync: async ({ block }) => {
        const newCommentsQueryResult = await refetch()
        const newCommentId = newCommentsQueryResult?.data.comments.find(
          (comment) => comment.commentcreatedeventcomment?.[0].inBlock === block
        )?.id
        setHighlightedComment(newCommentId || null)
        setCommentInputProcessing(false)
        setCommentBody('')
      },
      onError: () => {
        setCommentInputProcessing(false)
      },
      minimized: {
        signErrorMessage: 'Failed to post video comment',
      },
    })
  }

  return (
    <CommentsSectionWrapper>
      <CommentsSectionHeader>
        <Text variant="h400">
          {loading || (comments && !comments.length) ? 'Comments' : `${comments && comments.length} comments`}
        </Text>
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
      {comments && !comments.length && (
        <EmptyFallback title="Be the first to comment" subtitle="Nobody has left a comment under this video yet." />
      )}
      <CommentWrapper>
        <CommentInput
          processing={commentInputProcessing}
          readOnly={!activeMemberId}
          memberHandle={activeMembership?.handle}
          onFocus={() => !activeMemberId && openSignInDialog({ onConfirm: signIn })}
          onComment={() => handleCreate()}
          value={commentBody}
          onChange={(e) => setCommentBody(e.currentTarget.value)}
        />
        {loading
          ? placeholderItems.map((_, idx) => <Comment key={idx} type="default" loading />)
          : comments?.map((comment, idx) => (
              <Comment
                highlighted={comment.id === highlightedComment}
                key={`${comment.id}-${idx}`}
                loading={!comment.id}
                createdAt={new Date(comment.createdAt)}
                comment={comment.text}
                isEdited={comment.isEdited}
                onEditLabelClick={() => {
                  setShowEditHistory(true)
                  setOriginalComment(comment)
                }}
                isAbleToEdit={comment.author.id === activeMemberId}
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
                    : videoAuthorId === activeMemberId
                    ? 'options'
                    : 'default'
                }
              />
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
