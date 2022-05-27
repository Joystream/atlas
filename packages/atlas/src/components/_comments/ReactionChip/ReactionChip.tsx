import { FC } from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { REACTION_TYPE, ReactionId } from '@/config/reactions'
import { pluralizeNoun } from '@/utils/misc'
import { formatNumberShort } from '@/utils/number'

import { ReactionChipButton, StyledEmojiWrapper } from './ReactionChip.styles'

export type ReactionChipProps = {
  customId?: string
  active?: boolean
  count?: number
  reactionId: ReactionId
  state?: 'default' | 'disabled' | 'processing' | 'read-only'
  onReactionClick?: (type: ReactionId) => void
}

export const ReactionChip: FC<ReactionChipProps> = ({
  state = 'default',
  active = false,
  reactionId,
  count = 0,
  onReactionClick,
}) => {
  const isProcessing = state === 'processing'

  if (!count && state !== 'processing') {
    return null
  }

  return (
    <div>
      <ReactionChipButton
        state={isProcessing ? 'processing' : state}
        active={active}
        title={`${pluralizeNoun(count || 0, 'user')} reacted with ${REACTION_TYPE[reactionId].name}`}
        onClick={() => state === 'default' && onReactionClick?.(reactionId)}
      >
        <StyledEmojiWrapper block>{REACTION_TYPE[reactionId].emoji} </StyledEmojiWrapper>
        {isProcessing ? <Loader variant="xsmall" /> : <Text variant="t100">{formatNumberShort(count)}</Text>}
      </ReactionChipButton>
    </div>
  )
}
