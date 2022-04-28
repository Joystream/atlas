import styled from '@emotion/styled'
import React from 'react'

import { useCommentEdits } from '@/api/hooks'
import { CommentFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets'

import { CommentSnapshot } from '../CommentSnapshot'
import { GAP_BETWEEN_COMMENT_SNAPSHOTS } from '../CommentSnapshot/CommentSnaphsot.styles'

type CommentEditHistoryProps = {
  originalComment?: CommentFieldsFragment | null
}

export const CommentEditHistory: React.FC<CommentEditHistoryProps> = ({ originalComment }) => {
  const { commentEdits, loading } = useCommentEdits(originalComment?.id)
  const { url: memberAvatarUrl, isLoadingAsset } = useMemberAvatar(originalComment?.author)

  return commentEdits ? (
    <Container>
      {commentEdits?.map(({ id, newText, createdAt }) => (
        <CommentSnapshot
          key={id}
          createdAt={createdAt}
          memberHandle={originalComment?.author?.handle}
          memberUrl={absoluteRoutes.viewer.member(originalComment?.author?.handle)}
          text={newText}
          loading={loading}
          memberAvatarUrl={memberAvatarUrl || ''}
          isMemberAvatarLoading={isLoadingAsset}
        />
      ))}
    </Container>
  ) : null
}

const Container = styled.div`
  display: grid;
  gap: ${GAP_BETWEEN_COMMENT_SNAPSHOTS}px;
`
