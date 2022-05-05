import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useComments } from '@/api/hooks'
import { CommentFieldsFragment, CommentOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Text } from '@/components/Text'
import { Comment } from '@/components/_comments/Comment'
import { CommentEditHistory } from '@/components/_comments/CommentEditHistory'
import { Select } from '@/components/_inputs/Select'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { COMMENTS_SORT_OPTIONS } from '@/config/sorting'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user'

import { CommentWrapper, CommentsSectionHeader, CommentsSectionWrapper } from './VideoView.styles'

type CommentsSectionProps = {
  disabled?: boolean
  videoAuthorId?: string
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ disabled, videoAuthorId }) => {
  const [sortCommentsBy, setSortCommentsBy] = useState(CommentOrderByInput.ReactionsCountDesc)
  const [originalComment, setOriginalComment] = useState<CommentFieldsFragment | null>(null)
  const [showEditHistory, setShowEditHistory] = useState(false)
  const { id } = useParams()
  const { activeMemberId } = useUser()
  const { comments, loading } = useComments(
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
        {loading
          ? placeholderItems.map((_, idx) => <Comment key={idx} type="default" loading />)
          : comments?.map((comment, idx) => (
              <Comment
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
