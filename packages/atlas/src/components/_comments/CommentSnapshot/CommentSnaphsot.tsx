import { FC } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, transitions } from '@/styles'
import { formatDateTime } from '@/utils/time'

import {
  AvatarWrapper,
  CommentHeader,
  CommentHeaderDot,
  ContentWrapper,
  Line,
  StyledLink,
} from './CommentSnaphsot.styles'

import { CommentBody } from '../CommentBody'

export type CommentSnapshotProps = {
  isMemberAvatarLoading?: boolean
  memberAvatarUrl?: string
  memberUrl?: string
  memberHandle?: string
  loading?: boolean
  createdAt?: Date
  text?: string
  last?: boolean
}

export const CommentSnapshot: FC<CommentSnapshotProps> = ({
  memberAvatarUrl,
  isMemberAvatarLoading,
  memberHandle,
  loading,
  memberUrl = '',
  text,
  last,
  createdAt,
}) => {
  return (
    <ContentWrapper>
      <AvatarWrapper>
        <Link to={memberUrl}>
          <Avatar assetUrl={memberAvatarUrl} size={40} loading={isMemberAvatarLoading} clickable />
        </Link>
        {!last && <Line />}
      </AvatarWrapper>
      <SwitchTransition>
        <CSSTransition
          timeout={parseInt(cVar('animationTimingFast', true))}
          key={loading?.toString()}
          classNames={transitions.names.fade}
        >
          {loading ? (
            <div>
              <SkeletonLoader width={128} height={20} bottomSpace={8} />
              <SkeletonLoader width="100%" height={16} bottomSpace={8} />
              <SkeletonLoader width="70%" height={16} />
            </div>
          ) : (
            <section>
              <CommentHeader>
                <StyledLink to={memberUrl}>
                  <Text as="span" variant="h200">
                    {memberHandle}
                  </Text>
                </StyledLink>
                <CommentHeaderDot />
                <Text as="span" variant="t100" color="colorText">
                  {createdAt && formatDateTime(createdAt)}
                </Text>
              </CommentHeader>
              <CommentBody>{text}</CommentBody>
            </section>
          )}
        </CSSTransition>
      </SwitchTransition>
    </ContentWrapper>
  )
}
