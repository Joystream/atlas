import React from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'

import { EmojiContainer, ReactionChipButton } from './ReactionChip.styles'

export type ReactionChipProps = {
  active?: boolean
  counter?: number
  reaction: 'amusment' | 'love' | 'laugh' | 'shock' | 'anger'
  state?: 'default' | 'disabled' | 'processing'
}

export const REACTION_TYPE: Record<ReactionChipProps['reaction'], string> = {
  amusment: '👍 ',
  love: '❤️',
  laugh: '😂',
  shock: '🤯',
  anger: '😠',
}

export const ReactionChip: React.FC<ReactionChipProps> = ({
  state = 'default',
  active = false,
  reaction,
  counter = 0,
}) => {
  return (
    <ReactionChipButton state={state} active={active} title={`${counter} ${reaction}`}>
      <EmojiContainer>
        {state === 'processing' ? <Loader variant="xsmall" /> : <Text variant="t100">{REACTION_TYPE[reaction]}</Text>}
      </EmojiContainer>
      <Text variant="t100" margin={{ left: 2 }}>
        {counter}
      </Text>
    </ReactionChipButton>
  )
}
