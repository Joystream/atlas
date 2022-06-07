import { format } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { AvatarGroupUrlAvatar } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { SvgActionEdit, SvgActionMore, SvgActionReply, SvgActionTrash } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { ReactionsOnboardingPopover } from '@/components/_video/ReactionsOnboardingPopover'
import { REACTION_TYPE, ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'
import { useTouchDevice } from '@/hooks/useTouchDevice'
import { useMemberAvatar } from '@/providers/assets'
import { cVar, transitions } from '@/styles'
import { formatDate, formatDateAgo } from '@/utils/time'

import {
  CommentArticle,
  CommentFooter,
  CommentHeader,
  CommentHeaderDot,
  CommentWrapper,
  DeletedComment,
  HighlightableText,
  KebabMenuIconButton,
  ReactionsAndPopover,
  ReactionsWrapper,
  RepliesWrapper,
  ReplyButton,
  ShowRepliesTextButton,
  StyledAvatarGroup,
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
  author: BasicMembershipFieldsFragment | undefined
  memberHandle: string | undefined
  createdAt: Date | undefined
  text: string | undefined
  loading: boolean | undefined
  isEdited: boolean | undefined
  isAbleToEdit: boolean | undefined
  isModerated: boolean | undefined
  type: 'default' | 'deleted' | 'options' | 'processing'
  reactions: Omit<ReactionChipProps, 'onReactionClick'>[] | undefined
  reactionPopoverDismissed: boolean | undefined
  replyAvatars?: (AvatarGroupUrlAvatar & { handle: string })[]
  repliesOpen: boolean | undefined
  repliesCount: number | undefined
  isCommentFromUrl: boolean | undefined
  videoId: string | undefined
  commentId: string | undefined
  onEditedLabelClick: (() => void) | undefined
  onEditClick: (() => void) | undefined
  onDeleteClick: (() => void) | undefined
  onReplyClick: (() => void) | undefined
  onToggleReplies: (() => void) | undefined
  onReactionClick: ((reaction: ReactionId) => void) | undefined
} & Pick<CommentRowProps, 'highlighted' | 'indented' | 'memberUrl'>

export const InternalComment: React.FC<InternalCommentProps> = ({
  indented,
  highlighted,
  author,
  memberUrl,
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
  onReplyClick,
  replyAvatars,
  onToggleReplies,
  repliesOpen,
  repliesCount,
  isCommentFromUrl,
  videoId,
  commentId,
}) => {
  const [commentHover, setCommentHover] = useState(false)
  const [tempReactionId, setTempReactionId] = useState<ReactionId | null>(null)
  const isDeleted = type === 'deleted'
  const isProcessing = type === 'processing'
  const shouldShowKebabButton = type === 'options' && !loading && !isDeleted
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const isTouchDevice = useTouchDevice()
  const { url: memberAvatarUrl, isLoadingAsset: isMemberAvatarLoading } = useMemberAvatar(author)
  const filteredDuplicatedAvatars = repliesCount
    ? replyAvatars
      ? [...new Map(replyAvatars?.map((item) => [item.handle, item])).values()]
      : Array.from({ length: repliesCount }, () => ({ url: undefined }))
    : []

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
      title: 'Delete',
      destructive: true,
    },
  ]

  const domRef = useRef<HTMLDivElement>(null)
  const [highlightedPreviously, setHighlightedPreviously] = useState<boolean | undefined>(false)

  // scroll comment into view once the comment gets highlighted
  useEffect(() => {
    if (highlighted === true && !highlightedPreviously && !isCommentFromUrl) {
      domRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setHighlightedPreviously(highlighted)
  }, [highlightedPreviously, highlighted, isCommentFromUrl])

  const reactionIsProcessing = reactions?.some(({ state }) => state === 'processing')
  const reactionIsDisabled = reactions?.some(({ state }) => state === 'disabled')
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

  const sortedReactions = reactions && [...reactions].sort((a, b) => (b.count || 0) - (a.count || 0))
  return (
    <CommentRow
      processing={type === 'processing'}
      indented={indented}
      highlighted={highlighted}
      isMemberAvatarLoading={loading || isMemberAvatarLoading}
      memberUrl={memberUrl}
      memberAvatarUrl={memberAvatarUrl}
      onMouseEnter={() => setCommentHover(true)}
      onMouseLeave={() => setCommentHover(false)}
    >
      <CommentWrapper shouldShowKebabButton={shouldShowKebabButton} ref={domRef}>
        <SwitchTransition>
          <CSSTransition
            timeout={parseInt(cVar('animationTimingFast', true))}
            key={loading?.toString()}
            classNames={transitions.names.fade}
          >
            <CommentArticle isDeleted={isDeleted}>
              {loading ? (
                <>
                  <SkeletonLoader width={128} height={20} />
                  <SkeletonLoader width="100%" height={16} />
                  <SkeletonLoader width="70%" height={16} />
                </>
              ) : (
                <>
                  <CommentHeader>
                    <StyledLink to={memberUrl || ''} isProcessing={isProcessing}>
                      <Text variant="h200" margin={{ right: 2 }}>
                        {memberHandle}
                      </Text>
                    </StyledLink>
                    <CommentHeaderDot />
                    <Tooltip text={tooltipDate} placement="top" offsetY={4} delay={[1000, null]}>
                      <StyledLink
                        to={absoluteRoutes.viewer.video(videoId, { commentId })}
                        isProcessing={isProcessing}
                        onClick={(e) => e.preventDefault()}
                      >
                        <HighlightableText variant="t200" secondary margin={{ left: 2, right: 2 }}>
                          {formatDateAgo(createdAt || new Date())}
                        </HighlightableText>
                      </StyledLink>
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
                      <StyledSvgActionTrash /> Comment deleted by {isModerated ? 'channel owner' : 'author'}
                    </DeletedComment>
                  ) : (
                    <CommentBody>{text}</CommentBody>
                  )}
                </>
              )}
              <CommentFooter isProcessing={isProcessing}>
                {loading ? (
                  <ReactionsAndPopover>
                    <StyledFooterSkeletonLoader width={48} height={32} rounded />
                    <StyledFooterSkeletonLoader width={48} height={32} rounded />
                  </ReactionsAndPopover>
                ) : (
                  <ReactionsOnboardingPopover
                    ref={popoverRef}
                    onConfirm={() => {
                      tempReactionId && onReactionClick?.(tempReactionId)
                      handleOnboardingPopoverHide()
                    }}
                    onDecline={handleOnboardingPopoverHide}
                    trigger={
                      <ReactionsWrapper>
                        <ReactionsAndPopover>
                          {sortedReactions &&
                            sortedReactions?.map(({ reactionId, active, count, state }) => (
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
                            <ReactionPopover
                              disabled={reactionIsProcessing || reactionIsDisabled}
                              onReactionClick={handleCommentReactionClick}
                            />
                          )}
                        </ReactionsAndPopover>
                        <RepliesWrapper>
                          {!!repliesCount && filteredDuplicatedAvatars.length ? (
                            <StyledAvatarGroup
                              size="small"
                              avatarStrokeColor={highlighted ? cVar('colorBackground', true) : undefined}
                              avatars={filteredDuplicatedAvatars}
                              clickable={false}
                            />
                          ) : null}
                          {onToggleReplies && !!repliesCount && (
                            <ShowRepliesTextButton onClick={onToggleReplies} variant="tertiary" size="small">
                              {repliesOpen ? 'Hide' : 'Show'} {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                            </ShowRepliesTextButton>
                          )}
                          {onReplyClick && !isDeleted && !isProcessing && (commentHover || isTouchDevice) && (
                            <ReplyButton
                              onClick={onReplyClick}
                              variant="tertiary"
                              size="small"
                              _textOnly
                              icon={<SvgActionReply />}
                            >
                              Reply
                            </ReplyButton>
                          )}
                        </RepliesWrapper>
                      </ReactionsWrapper>
                    }
                  />
                )}
              </CommentFooter>
            </CommentArticle>
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
    </CommentRow>
  )
}
