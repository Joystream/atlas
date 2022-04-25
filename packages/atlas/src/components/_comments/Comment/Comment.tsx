import { format } from 'date-fns'
import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { SvgActionEdit, SvgActionMore, SvgActionTrash } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { cVar, transitions } from '@/styles'
import { formatDate, formatDateAgo } from '@/utils/time'

import {
  CommentBody,
  CommentHeader,
  CommentHeaderDot,
  CommentWrapper,
  HighlightableText,
  KebabMenuIconButton,
  StyledLink,
  StyledSvgActionTrash,
} from './Comment.styles'

import { CommentRow, CommentRowProps } from '../CommentRow'

export type CommentProps = {
  memberHandle?: string
  createdAt?: Date
  comment?: string
  loading?: boolean
  isEdited?: boolean
  isAbleToEdit?: boolean
  type: 'default' | 'deleted' | 'options'
  onEditLabelClick?: () => void
  onEditClick?: () => void
  onDeleteClick?: () => void
} & CommentRowProps

export const Comment: React.FC<CommentProps> = ({
  indented,
  highlighted,
  memberHandle,
  comment,
  createdAt,
  type,
  loading,
  isMemberAvatarLoading,
  memberUrl,
  memberAvatarUrl,
  isEdited,
  isAbleToEdit,
  onEditLabelClick,
  onEditClick,
  onDeleteClick,
}) => {
  const isDeleted = type === 'deleted'
  const shouldShowKebabButton = type === 'options' && !loading && !isDeleted

  const tooltipDate = createdAt ? `${formatDate(createdAt || new Date())} at ${format(createdAt, 'HH:mm')}` : undefined

  const contexMenuItems = [
    ...(isAbleToEdit
      ? [
          {
            icon: <SvgActionEdit />,
            onClick: onEditClick,
            title: 'Edit',
          },
        ]
      : []),
    {
      icon: <SvgActionTrash />,
      onClick: onDeleteClick,
      title: 'Remove',
      destructive: true,
    },
  ]

  return (
    <CommentRow
      indented={indented}
      highlighted={highlighted}
      isMemberAvatarLoading={loading || isMemberAvatarLoading}
      memberUrl={memberUrl}
      memberAvatarUrl={memberAvatarUrl}
    >
      <CommentWrapper shouldShowKebabButton={shouldShowKebabButton}>
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
              <div>
                <CommentHeader>
                  <StyledLink to={memberUrl || ''}>
                    <Text variant="h200" margin={{ right: 2 }}>
                      {memberHandle}
                    </Text>
                  </StyledLink>
                  <CommentHeaderDot />
                  <Tooltip text={tooltipDate} placement="top" offsetY={4} delay={[1000, null]}>
                    {/*  TODO timestamp should be a hyperlink to that comment. */}
                    <HighlightableText variant="t200" secondary margin={{ left: 2, right: 2 }}>
                      {formatDateAgo(createdAt || new Date())}
                    </HighlightableText>
                  </Tooltip>
                  {isEdited && !isDeleted && (
                    <>
                      <CommentHeaderDot />
                      <HighlightableText variant="t200" secondary margin={{ left: 2 }} onClick={onEditLabelClick}>
                        edited
                      </HighlightableText>
                    </>
                  )}
                </CommentHeader>
                <CommentBody variant="t200" secondary color={isDeleted ? cVar('colorTextMuted') : undefined}>
                  {isDeleted ? (
                    <>
                      <StyledSvgActionTrash /> Comment deleted by Author
                    </>
                  ) : (
                    comment
                  )}
                </CommentBody>
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
        <ContextMenu
          placement="bottom-end"
          disabled={loading}
          items={contexMenuItems}
          trigger={
            <KebabMenuIconButton variant="tertiary" size="small" isActive={shouldShowKebabButton}>
              <SvgActionMore />
            </KebabMenuIconButton>
          }
        />
      </CommentWrapper>
      {/* TODO add reactions footer here */}
    </CommentRow>
  )
}
