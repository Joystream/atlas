import React from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
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
  onReactionClick?: (type: ReactionId) => void
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
  count,
  onReactionClick,
}) => {
  const isProcessing = state === 'processing'
  return (
    <ReactionChipButton
      state={state}
      active={active}
      title={`${pluralizeNoun(count || 0, 'user')} reacted with ${reactionAccessibleName[reactionId]}`}
      onClick={() => state === 'default' && onReactionClick?.(reactionId)}
    >
      <EmojiContainer>{REACTION_TYPE[reactionId]} </EmojiContainer>
      {state === 'processing' ? <Loader variant="xsmall" /> : <Text variant="t100">{formatNumberShort(count)}</Text>}
    </ReactionChipButton>
  )
}
