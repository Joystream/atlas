import styled from '@emotion/styled'
import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useCommentEdits } from '@/api/hooks/comments'
import { CommentFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { cVar, transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { CommentSnapshot } from '../CommentSnapshot'
import { GAP_BETWEEN_COMMENT_SNAPSHOTS } from '../CommentSnapshot/CommentSnaphsot.styles'

type CommentEditHistoryProps = {
  originalComment?: CommentFieldsFragment | null
}

export const CommentEditHistory: FC<CommentEditHistoryProps> = ({ originalComment }) => {
  const { commentEdits, loading } = useCommentEdits(originalComment?.id)
  const { urls: memberAvatarUrls, isLoadingAsset } = getMemberAvatar(originalComment?.author)

  const placeholderItems = createPlaceholderData(3)

  return (
    <SwitchTransition>
      <CSSTransition
        timeout={parseInt(cVar('animationTimingFast', true))}
        key={loading?.toString()}
        classNames={transitions.names.fade}
      >
        {loading ? (
          <Container>
            {placeholderItems.map((_, idx) => (
              <CommentSnapshot key={idx} loading={loading} last={placeholderItems?.length === idx + 1} />
            ))}
          </Container>
        ) : (
          <Container>
            {commentEdits?.map((commentEdit, idx) => {
              return (
                <CommentSnapshot
                  key={commentEdit.id}
                  last={commentEdits?.length === idx + 1}
                  createdAt={commentEdit.timestamp}
                  memberHandle={originalComment?.author?.handle}
                  memberUrl={absoluteRoutes.viewer.member(originalComment?.author?.handle)}
                  text={commentEdit.data.text}
                  loading={loading}
                  memberAvatarUrls={memberAvatarUrls}
                  isMemberAvatarLoading={isLoadingAsset}
                />
              )
            })}
          </Container>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

const Container = styled.div`
  display: grid;
  gap: ${GAP_BETWEEN_COMMENT_SNAPSHOTS}px;
`
