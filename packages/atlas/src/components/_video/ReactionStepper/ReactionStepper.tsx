import React from 'react'

import { Text } from '@/components/Text'
import { SvgActionDislikeOutline, SvgActionLikeOutline } from '@/components/_icons'
import { formatNumberShort } from '@/utils/number'

import { ReactionBar, ReactionBarProgress, ReactionButton, ReactionStepperWrapper } from './ReactionStepper.styles'

// proccessing means that there is ongoing transaction
type ReactionSteppperState = 'liked' | 'disliked' | 'default' | 'loading' | 'processing'

export type ReactionStepperProps = {
  likes?: number
  dislikes?: number
  onLike?: () => void
  onDislike?: () => void
  state: ReactionSteppperState
}

export const ReactionStepper: React.FC<ReactionStepperProps> = ({
  likes = 0,
  dislikes = 0,
  onDislike,
  onLike,
  state,
}) => {
  const total = likes + dislikes
  const likesPercent = total ? Number((likes / total).toFixed(4)) : 0
  return (
    <ReactionStepperWrapper>
      <ReactionButton>
        <SvgActionLikeOutline /> <Text variant="t200">{formatNumberShort(likes)} </Text>
      </ReactionButton>
      <ReactionButton>
        <SvgActionDislikeOutline /> <Text variant="t200">{formatNumberShort(dislikes)}</Text>
      </ReactionButton>
      <ReactionBar>
        <ReactionBarProgress likesPercent={likesPercent} />
      </ReactionBar>
    </ReactionStepperWrapper>
  )
}
