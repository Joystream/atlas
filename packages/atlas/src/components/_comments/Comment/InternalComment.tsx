import BN from 'bn.js'
import { format } from 'date-fns'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { CommentTipTier } from '@/api/queries/__generated__/baseTypes.generated'
import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronB, SvgActionChevronT, SvgActionEdit, SvgActionMore, SvgActionTrash } from '@/assets/icons'
import { AvatarGroupUrlAvatar } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { TextButton } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { ReactionsOnboardingPopover } from '@/components/_video/ReactionsOnboardingPopover'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { UNCONFIRMED } from '@/hooks/useOptimisticActions'
import { useTouchDevice } from '@/hooks/useTouchDevice'
import { CommentReaction } from '@/joystream-lib/types'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { cVar, transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
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
  ReplyButtonWrapper,
  StyledAvatarGroup,
  StyledFooterSkeletonLoader,
  StyledLink,
  StyledSvgActionTrash,
} from './Comment.styles'
import { CommentTierBadge } from './CommentTierBadge'

import { CommentBody } from '../CommentBody'
import { CommentRow, CommentRowProps } from '../CommentRow'
import { ReactionChip, ReactionChipProps } from '../ReactionChip'
import { ReactionPopover } from '../ReactionPopover'

export type DeletedBy = 'author' | 'channel owner' | 'operator'

export type InternalCommentProps = {
  author: BasicMembershipFieldsFragment | undefined
  memberHandle: string | undefined
  createdAt: Date | undefined
  text: string | undefined
  loading: boolean | undefined
  isEdited: boolean | undefined
  isAbleToEdit: boolean | undefined
  deletedBy?: DeletedBy
  type: 'default' | 'deleted' | 'options' | 'processing'
  reactions: Omit<ReactionChipProps, 'onReactionClick'>[] | undefined
  reactionPopoverDismissed: boolean | undefined
  replyAvatars?: (AvatarGroupUrlAvatar & { handle: string })[]
  repliesOpen: boolean | undefined
  repliesCount: number | undefined
  isCommentFromUrl: boolean | undefined
  videoId: string | undefined
  commentId: string | undefined
  reactionFee: BN | undefined
  tipTier: CommentTipTier | null | undefined
  tipAmount: string | undefined
  onEditedLabelClick: (() => void) | undefined
  onEditClick: (() => void) | undefined
  onDeleteClick: (() => void) | undefined
  onReplyClick: (() => void) | undefined
  onToggleReplies: (() => void) | undefined
  onReactionClick: ((reaction: CommentReaction) => void) | undefined
  onOnBoardingPopoverOpen: ((reaction: CommentReaction) => Promise<void>) | undefined
} & Pick<CommentRowProps, 'highlighted' | 'indented' | 'memberUrl'>

export const InternalComment: FC<InternalCommentProps> = ({
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
  deletedBy,
  isAbleToEdit,
  reactionPopoverDismissed,
  reactionFee,
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
  tipAmount,
  tipTier,
}) => {
  const [commentHover, setCommentHover] = useState(false)
  // tempReactionId is used to show processing state on the reaction when the onboarding popover is opened for it
  const [tempReactionId, setTempReactionId] = useState<CommentReaction | null>(null)
  const isDeleted = type === 'deleted'
  const isProcessing = type === 'processing'
  const isUnconfirmed = commentId?.includes(UNCONFIRMED)
  const shouldShowKebabButton = type === 'options' && !loading && !isDeleted

  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const isTouchDevice = useTouchDevice()
  const { urls: memberAvatarUrls, isLoadingAsset: isMemberAvatarLoading } = getMemberAvatar(author)
  const filteredDuplicatedAvatars = repliesCount
    ? replyAvatars
      ? [...new Map(replyAvatars?.map((item) => [item.handle, item])).values()]
      : createPlaceholderData(repliesCount, { urls: undefined })
    : []

  const tooltipDate = createdAt ? `${formatDate(createdAt || new Date())} at ${format(createdAt, 'HH:mm')}` : undefined

  const contexMenuItems = [
    ...(isAbleToEdit
      ? [
          {
            nodeStart: <SvgActionEdit />,
            onClick: onEditClick,
            label: 'Edit',
          },
        ]
      : []),
    {
      nodeStart: <SvgActionTrash />,
      onClick: onDeleteClick,
      label: 'Delete',
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

  const isSomeReactionDisabled = reactions?.some(({ state }) => state === 'disabled')

  const allReactionsApplied =
    reactions && reactions.filter((r) => r.count).length >= atlasConfig.features.comments.reactions.length

  const handleOnboardingPopoverHide = useCallback(() => {
    popoverRef.current?.hide()
    setTempReactionId(null)
  }, [])

  const handleCommentReactionClick = useCallback(
    async (reactionId: CommentReaction) => {
      onReactionClick?.(reactionId)

      if (!reactionPopoverDismissed) {
        popoverRef.current?.show()
      }
    },
    [onReactionClick, reactionPopoverDismissed]
  )

  const sortedReactions = reactions && [...reactions].sort((a, b) => (b.count || 0) - (a.count || 0))
  const hasReactionsAndCommentIsNotDeleted = isDeleted ? !!sortedReactions?.find((r) => r.count) : true
  return (
    <CommentRow
      processing={type === 'processing'}
      indented={indented}
      highlighted={highlighted}
      isMemberAvatarLoading={loading || isMemberAvatarLoading}
      memberUrl={memberUrl}
      memberAvatarUrls={memberAvatarUrls}
      tipTier={tipTier}
      onMouseEnter={() => setCommentHover(true)}
      onMouseLeave={() => setCommentHover(false)}
    >
      <CommentWrapper isUnconfirmed={isUnconfirmed} shouldShowKebabButton={shouldShowKebabButton} ref={domRef}>
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
                      <Text as="span" variant="h200" margin={{ right: 2 }}>
                        {memberHandle}
                      </Text>
                    </StyledLink>
                    {!!(tipTier && tipAmount) && (
                      <>
                        <CommentHeaderDot />
                        <CommentTierBadge tier={tipTier} amount={Math.floor(hapiBnToTokenNumber(new BN(tipAmount)))} />
                      </>
                    )}
                    <CommentHeaderDot />
                    <Tooltip text={tooltipDate} placement="top" offsetY={4} delay={[1000, null]}>
                      <StyledLink
                        to={absoluteRoutes.viewer.video(videoId, { commentId })}
                        isProcessing={isProcessing}
                        onClick={(e) => e.preventDefault()}
                      >
                        <HighlightableText as="span" variant="t100" color="colorText" margin={{ left: 2, right: 2 }}>
                          {formatDateAgo(createdAt || new Date())}
                        </HighlightableText>
                      </StyledLink>
                    </Tooltip>
                    {isEdited && !isDeleted && (
                      <>
                        <CommentHeaderDot />
                        <HighlightableText
                          as="span"
                          variant="t100"
                          color="colorText"
                          margin={{ left: 2 }}
                          onClick={onEditedLabelClick}
                        >
                          edited
                        </HighlightableText>
                      </>
                    )}
                  </CommentHeader>
                  {isDeleted ? (
                    <DeletedComment as="span" variant="t100" color="colorTextMuted">
                      <StyledSvgActionTrash /> Comment deleted by {deletedBy}
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
                    fee={reactionFee}
                    onConfirm={() => {
                      tempReactionId && onReactionClick?.(tempReactionId)
                      handleOnboardingPopoverHide()
                    }}
                    onDecline={handleOnboardingPopoverHide}
                    trigger={
                      <ReactionsWrapper>
                        {!isUnconfirmed && hasReactionsAndCommentIsNotDeleted && (
                          <ProtectedActionWrapper
                            title="You want to react to this comment?"
                            description="Sign in to let others know what you think"
                          >
                            <ReactionsAndPopover>
                              {sortedReactions?.map(({ reactionId, active, count, state }) => (
                                <ReactionChip
                                  key={reactionId}
                                  reactionId={reactionId}
                                  active={active}
                                  count={count}
                                  state={tempReactionId === reactionId ? 'processing' : state}
                                  onReactionClick={handleCommentReactionClick}
                                />
                              ))}
                              {!allReactionsApplied && !isDeleted && (
                                <ReactionPopover
                                  disabled={isSomeReactionDisabled}
                                  onReactionClick={handleCommentReactionClick}
                                />
                              )}
                            </ReactionsAndPopover>
                          </ProtectedActionWrapper>
                        )}

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
                            <TextButton
                              onClick={onToggleReplies}
                              variant="tertiary"
                              size="small"
                              iconPlacement="right"
                              icon={repliesOpen ? <SvgActionChevronT /> : <SvgActionChevronB />}
                            >
                              {repliesOpen ? 'Hide' : 'Show'} {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                            </TextButton>
                          )}
                          {onReplyClick &&
                            !isUnconfirmed &&
                            !isDeleted &&
                            !isProcessing &&
                            (commentHover || isTouchDevice) && (
                              <ReplyButtonWrapper>
                                <ProtectedActionWrapper
                                  title="You want to reply to this comment?"
                                  description="Sign in to let others know what you think"
                                >
                                  <ReplyButton onClick={onReplyClick} variant="tertiary" size="small" _textOnly>
                                    Reply
                                  </ReplyButton>
                                </ProtectedActionWrapper>
                              </ReplyButtonWrapper>
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
        {!isUnconfirmed ? (
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
        ) : null}
      </CommentWrapper>
    </CommentRow>
  )
}
