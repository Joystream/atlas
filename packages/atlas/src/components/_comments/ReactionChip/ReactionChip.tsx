import React from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'

import { EmojiContainer, ReactionChipButton } from './ReactionChip.styles'

export type ReactionType = 'amusment' | 'love' | 'laugh' | 'shock' | 'anger'

export type ReactionChipProps = {
  active?: boolean
  count?: number
  type: ReactionType
  state?: 'default' | 'disabled' | 'processing' | 'read-only'
  onReactionClick: (type: ReactionType) => void
}

export const REACTION_TYPE: Record<ReactionType, string> = {
  amusment: '👍 ',
  love: '❤️',
  laugh: '😂',
  shock: '🤯',
  anger: '😠',
}

export const ReactionChip: React.FC<ReactionChipProps> = ({
  state = 'default',
  active = false,
  type,
  count = 0,
  onReactionClick,
}) => {
  return (
    <ReactionChipButton state={state} active={active} title={`${count} ${type}`} onClick={() => onReactionClick(type)}>
      {state === 'processing' ? <Loader variant="xsmall" /> : <EmojiContainer>{REACTION_TYPE[type]} </EmojiContainer>}
      <Text variant="t100" margin={{ left: 2 }}>
        {count}
      </Text>
    </ReactionChipButton>
  )
}
