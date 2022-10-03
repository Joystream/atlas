import { FC } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { Loader } from '@/components/_loaders/Loader'
import { atlasConfig } from '@/config'
import { CommentReaction } from '@/joystream-lib/types'
import { pluralizeNoun } from '@/utils/misc'

import { ReactionChipButton, StyledEmojiWrapper } from './ReactionChip.styles'

export type ReactionChipProps = {
  customId?: string
  active?: boolean
  count?: number
  reactionId: CommentReaction
  state?: 'default' | 'disabled' | 'processing' | 'read-only'
  onReactionClick?: (type: CommentReaction) => void
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

  const reactionInfo = atlasConfig.derived.commentReactionsLookup[reactionId]

  return (
    <div>
      <ReactionChipButton
        state={isProcessing ? 'processing' : state}
        active={active}
        title={`${pluralizeNoun(count || 0, 'user')} reacted with ${reactionInfo.name}`}
        onClick={() => state === 'default' && onReactionClick?.(reactionId)}
      >
        <StyledEmojiWrapper readOnly={state === 'read-only'} block>
          {reactionInfo.emoji}{' '}
        </StyledEmojiWrapper>
        {isProcessing ? (
          <Loader variant="xsmall" />
        ) : (
          <NumberFormat
            as="span"
            variant="t100"
            color={!active ? 'colorText' : undefined}
            format="short"
            value={count}
          />
        )}
      </ReactionChipButton>
    </div>
  )
}
