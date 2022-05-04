import React, { useEffect, useRef } from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { ReactionsOnboardingPopover } from '@/components/_video/ReactionsOnboardingPopover'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumberShort } from '@/utils/number'

import { EmojiContainer, ReactionChipButton } from './ReactionChip.styles'

export type ReactionId = 1 | 2 | 3 | 4 | 5

export type ReactionType = 'like' | 'love' | 'laugh' | 'shock' | 'anger'

export type ReactionChipProps = {
  customId?: string
  active?: boolean
  count?: number
  reactionId: ReactionId
  state?: 'default' | 'disabled' | 'processing' | 'read-only'
  onReactionClick?: (type: ReactionId, reactionPopoverDismissed: boolean) => void
  onPopoverHide?: () => void
  reactionPopoverDismissed: boolean
}

export const REACTION_TYPE: Record<ReactionId, string> = {
  1: '👍 ',
  2: '❤️',
  3: '😂',
  4: '🤯',
  5: '😠',
}

export const reactionAccessibleName: Record<ReactionId, ReactionType> = {
  1: 'like',
  2: 'love',
  3: 'laugh',
  4: 'shock',
  5: 'anger',
}

export const ReactionChip: React.FC<ReactionChipProps> = ({
  state = 'default',
  active = false,
  reactionId,
  count = 0,
  onReactionClick,
  onPopoverHide,
  reactionPopoverDismissed,
}) => {
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const isProcessing = state === 'processing'

  useEffect(() => {
    if (state === 'processing' && !reactionPopoverDismissed) {
      popoverRef.current?.show()
    }
  }, [reactionPopoverDismissed, state])

  const handleReact = (reactionPopoverDismissed: boolean) => {
    onReactionClick?.(reactionId, reactionPopoverDismissed)
  }
  return (
    <ReactionsOnboardingPopover
      ref={popoverRef}
      disabled={reactionPopoverDismissed}
      onConfirm={() => {
        handleReact(true)
      }}
      onDecline={() => {
        popoverRef.current?.hide()
        onPopoverHide?.()
      }}
      trigger={
        !count && state !== 'processing' ? null : (
          <ReactionChipButton
            state={isProcessing ? 'processing' : state}
            active={active}
            title={`${pluralizeNoun(count || 0, 'user')} reacted with ${reactionAccessibleName[reactionId]}`}
            onClick={() => state === 'default' && handleReact(reactionPopoverDismissed)}
          >
            <EmojiContainer>{REACTION_TYPE[reactionId]} </EmojiContainer>
            {isProcessing ? <Loader variant="xsmall" /> : <Text variant="t100">{formatNumberShort(count)}</Text>}
          </ReactionChipButton>
        )
      }
    />
  )
}
