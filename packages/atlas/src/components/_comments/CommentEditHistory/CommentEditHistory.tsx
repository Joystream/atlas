import styled from '@emotion/styled'
import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useCommentEdits } from '@/api/hooks/comments'
import { CommentFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
import { cVar, transitions } from '@/styles'

import { CommentSnapshot } from '../CommentSnapshot'
import { GAP_BETWEEN_COMMENT_SNAPSHOTS } from '../CommentSnapshot/CommentSnaphsot.styles'

type CommentEditHistoryProps = {
  originalComment?: CommentFieldsFragment | null
}

export const CommentEditHistory: FC<CommentEditHistoryProps> = ({ originalComment }) => {
  const { commentEdits, loading } = useCommentEdits(originalComment?.id)
  const { url: memberAvatarUrl, isLoadingAsset } = useMemberAvatar(originalComment?.author)

  const placeholderItems = Array.from({ length: 3 }, () => ({ id: undefined }))

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
            {commentEdits?.map(({ id, newText, createdAt }, idx) => {
              return (
                <CommentSnapshot
                  key={id}
                  last={commentEdits?.length === idx + 1}
                  createdAt={createdAt}
                  memberHandle={originalComment?.author?.handle}
                  memberUrl={absoluteRoutes.viewer.member(originalComment?.author?.handle)}
                  text={newText}
                  loading={loading}
                  memberAvatarUrl={memberAvatarUrl || ''}
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
