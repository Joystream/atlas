import { format } from 'date-fns'
import React, { useCallback } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { SvgActionEdit, SvgActionMore, SvgActionTrash } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { cVar, transitions } from '@/styles'
import { formatDate, formatDateAgo } from '@/utils/time'

import {
  CommentFooter,
  CommentFooterItems,
  CommentHeader,
  CommentHeaderDot,
  CommentWrapper,
  DeletedComment,
  HighlightableText,
  KebabMenuIconButton,
  StyledFooterSkeletonLoader,
  StyledLink,
  StyledSvgActionTrash,
} from './Comment.styles'

import { CommentBody } from '../CommentBody'
import { CommentRow, CommentRowProps } from '../CommentRow'
import { REACTION_TYPE, ReactionChip, ReactionChipProps, ReactionType } from '../ReactionChip'
import { ReactionChipState } from '../ReactionChip/ReactionChip.styles'
import { ReactionPopover } from '../ReactionPopover'

export type CommentProps = {
  memberHandle?: string
  createdAt?: Date
  comment?: string
  loading?: boolean
  isEdited?: boolean
  isAbleToEdit?: boolean
  type: 'default' | 'deleted' | 'options'
  reactions?: Omit<ReactionChipProps, 'onReactionClick'>[]
  onEditLabelClick?: () => void
  onEditClick?: () => void
  onDeleteClick?: () => void
  onReactionClick?: (reaction: ReactionType) => void
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
  onReactionClick,
  reactions,
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

  const reactionIsProcessing = reactions?.some(({ state }) => state === 'processing')
  const allReactionsApplied = reactions && reactions?.length >= Object.values(REACTION_TYPE).length

  const getReactionState = useCallback(
    (state?: ReactionChipState): ReactionChipState | undefined => {
      if (state === 'processing') {
        return state
      }
      if (isDeleted) {
        return 'read-only'
      }
      if (reactionIsProcessing) {
        return 'disabled'
      }
      return state
    },
    [isDeleted, reactionIsProcessing]
  )

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
                {isDeleted ? (
                  <DeletedComment variant="t200" color={cVar('colorTextMuted')}>
                    <StyledSvgActionTrash /> Comment deleted by Author
                  </DeletedComment>
                ) : (
                  <CommentBody>{comment}</CommentBody>
                )}
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
      <CommentFooter>
        <SwitchTransition>
          <CSSTransition
            timeout={parseInt(cVar('animationTimingFast', true))}
            key={loading?.toString()}
            classNames={transitions.names.fade}
          >
            {loading ? (
              <CommentFooterItems>
                <StyledFooterSkeletonLoader width={48} height={32} rounded />
                <StyledFooterSkeletonLoader width={48} height={32} rounded />
              </CommentFooterItems>
            ) : (
              <CommentFooterItems>
                {reactions &&
                  reactions.length > 0 &&
                  reactions.map(({ type, active, count, state }) => (
                    <ReactionChip
                      key={type}
                      type={type}
                      active={active}
                      count={count}
                      state={getReactionState(state)}
                      onReactionClick={onReactionClick}
                    />
                  ))}
                {!allReactionsApplied && !isDeleted && (
                  <ReactionPopover disabled={reactionIsProcessing} onReactionClick={onReactionClick} />
                )}
              </CommentFooterItems>
            )}
          </CSSTransition>
        </SwitchTransition>
      </CommentFooter>
    </CommentRow>
  )
}
