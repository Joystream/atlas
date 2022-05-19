import { format } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { SvgActionEdit, SvgActionMore, SvgActionTrash } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { ReactionsOnboardingPopover } from '@/components/_video/ReactionsOnboardingPopover'
import { REACTION_TYPE, ReactionId } from '@/config/reactions'
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
import { ReactionChip, ReactionChipProps } from '../ReactionChip'
import { ReactionChipState } from '../ReactionChip/ReactionChip.styles'
import { ReactionPopover } from '../ReactionPopover'

export type InternalCommentProps = {
  memberHandle: string | undefined
  createdAt: Date | undefined
  text: string | undefined
  loading: boolean | undefined
  isEdited: boolean | undefined
  isAbleToEdit: boolean | undefined
  isModerated: boolean | undefined
  type: 'default' | 'deleted' | 'options'
  reactions: Omit<ReactionChipProps, 'onReactionClick'>[] | undefined
  reactionPopoverDismissed: boolean | undefined
  onEditedLabelClick: (() => void) | undefined
  onEditClick: (() => void) | undefined
  onDeleteClick: (() => void) | undefined
  onReactionClick: ((reaction: ReactionId) => void) | undefined
} & CommentRowProps

export const InternalComment: React.FC<InternalCommentProps> = ({
  indented,
  highlighted,
  isMemberAvatarLoading,
  memberUrl,
  memberAvatarUrl,
  memberHandle,
  text,
  createdAt,
  type,
  loading,
  isEdited,
  isModerated,
  isAbleToEdit,
  reactionPopoverDismissed,
  onEditedLabelClick,
  onEditClick,
  onDeleteClick,
  onReactionClick,
  reactions,
}) => {
  const isDeleted = type === 'deleted'
  const shouldShowKebabButton = type === 'options' && !loading && !isDeleted
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const [tempReactionId, setTempReactionId] = useState<ReactionId | null>(null)

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

  const domRef = useRef<HTMLDivElement>(null)
  const [highlightedPreviously, setHighlightedPreviously] = useState<boolean | undefined>(false)

  // scroll comment into view once the comment gets highlighted
  useEffect(() => {
    if (highlighted === true && !highlightedPreviously) {
      domRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setHighlightedPreviously(highlighted)
  }, [highlightedPreviously, highlighted])

  const reactionIsProcessing = reactions?.some(({ state }) => state === 'processing')
  const allReactionsApplied =
    reactions && reactions.filter((r) => r.count).length >= Object.values(REACTION_TYPE).length

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

  const handleOnboardingPopoverHide = useCallback(() => {
    popoverRef.current?.hide()
    setTempReactionId(null)
  }, [])

  const handleCommentReactionClick = useCallback(
    (reactionId: ReactionId) => {
      if (!reactionPopoverDismissed) {
        setTempReactionId(reactionId)
        popoverRef.current?.show()
      } else {
        onReactionClick?.(reactionId)
      }
    },
    [onReactionClick, reactionPopoverDismissed]
  )

  return (
    <CommentRow
      indented={indented}
      highlighted={highlighted}
      isMemberAvatarLoading={loading || isMemberAvatarLoading}
      memberUrl={memberUrl}
      memberAvatarUrl={memberAvatarUrl}
    >
      <CommentWrapper ref={domRef} shouldShowKebabButton={shouldShowKebabButton}>
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
                <CommentHeader isDeleted={isDeleted}>
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
                      <HighlightableText variant="t200" secondary margin={{ left: 2 }} onClick={onEditedLabelClick}>
                        edited
                      </HighlightableText>
                    </>
                  )}
                </CommentHeader>
                {isDeleted ? (
                  <DeletedComment variant="t200" color={cVar('colorTextMuted')}>
                    <StyledSvgActionTrash /> Comment deleted by the {isModerated ? 'channel owner' : 'author'}
                  </DeletedComment>
                ) : (
                  <CommentBody>{text}</CommentBody>
                )}
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
        <ContextMenu
          placement="bottom-end"
          disabled={loading || !shouldShowKebabButton}
          items={contexMenuItems}
          trigger={
            <KebabMenuIconButton
              icon={<SvgActionMore />}
              variant="tertiary"
              size="small"
              isActive={shouldShowKebabButton}
            />
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
              <ReactionsOnboardingPopover
                ref={popoverRef}
                onConfirm={() => {
                  tempReactionId && onReactionClick?.(tempReactionId)
                  handleOnboardingPopoverHide()
                }}
                onDecline={handleOnboardingPopoverHide}
                trigger={
                  <CommentFooterItems>
                    {reactions &&
                      reactions?.map(({ reactionId, active, count, state }) => (
                        <ReactionChip
                          key={reactionId}
                          reactionId={reactionId}
                          active={active}
                          count={count}
                          state={tempReactionId === reactionId ? 'processing' : getReactionState(state)}
                          onReactionClick={handleCommentReactionClick}
                        />
                      ))}
                    {!allReactionsApplied && !isDeleted && (
                      <ReactionPopover disabled={reactionIsProcessing} onReactionClick={handleCommentReactionClick} />
                    )}
                  </CommentFooterItems>
                }
              />
            )}
          </CSSTransition>
        </SwitchTransition>
      </CommentFooter>
    </CommentRow>
  )
}
