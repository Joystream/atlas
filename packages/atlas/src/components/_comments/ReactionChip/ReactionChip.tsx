import React, { useEffect, useRef } from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { ReactionsOnboardingPopover } from '@/components/_video/ReactionsOnboardingPopover'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumberShort } from '@/utils/number'

import { EmojiContainer, ReactionChipButton } from './ReactionChip.styles'

export type ReactionId = 1 | 2 | 3 | 4 | 5

export type ReactionChipProps = {
  customId?: string
  active?: boolean
  count?: number
  reactionId: ReactionId
  state?: 'default' | 'disabled' | 'processing' | 'read-only'
  onReactionClick?: (type: ReactionId, reactionPopoverDismissed?: boolean) => void
  onPopoverHide?: () => void
  reactionPopoverDismissed?: boolean
}

export const REACTION_TYPE = {
  1: { emoji: '👍', name: 'like' },
  2: { emoji: '❤️', name: 'love' },
  3: { emoji: '😂', name: 'laugh' },
  4: { emoji: '🤯', name: 'shock' },
  5: { emoji: '😠', name: 'anger' },
} as const

export const ReactionChip: React.FC<ReactionChipProps> = ({
  state = 'default',
  active = false,
  reactionId,
  count = 0,
  onReactionClick,
  onPopoverHide,
  reactionPopoverDismissed = false,
}) => {
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const isProcessing = state === 'processing'

  useEffect(() => {
    if (state === 'processing' && !reactionPopoverDismissed) {
      popoverRef.current?.show()
    }
  }, [reactionPopoverDismissed, state])

  if (!count && state !== 'processing') {
    return null
  }

  return (
    <div>
      <ReactionsOnboardingPopover
        ref={popoverRef}
        disabled={reactionPopoverDismissed}
        onConfirm={() => {
          onReactionClick?.(reactionId, true)
        }}
        onDecline={() => {
          popoverRef.current?.hide()
          onPopoverHide?.()
        }}
        trigger={
          <ReactionChipButton
            state={isProcessing ? 'processing' : state}
            active={active}
            title={`${pluralizeNoun(count || 0, 'user')} reacted with ${REACTION_TYPE[reactionId].name}`}
            onClick={() => state === 'default' && onReactionClick?.(reactionId, reactionPopoverDismissed)}
          >
            <EmojiContainer>{REACTION_TYPE[reactionId].emoji} </EmojiContainer>
            {isProcessing ? <Loader variant="xsmall" /> : <Text variant="t100">{formatNumberShort(count)}</Text>}
          </ReactionChipButton>
        }
      />
    </div>
  )
}
