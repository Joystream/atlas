import React from 'react'

import { ReactionButton, ReactionSteppperState } from './ReactionButton'
import { ReactionBar, ReactionBarProgress, ReactionStepperWrapper } from './ReactionStepper.styles'

export type ReactionStepperProps = {
  likes?: number
  dislikes?: number
  onLike?: () => void
  onDislike?: () => void
  state: ReactionSteppperState
  className?: string
}

export const ReactionStepper: React.FC<ReactionStepperProps> = ({
  likes = 0,
  dislikes = 0,
  onDislike,
  onLike,
  state,
  className,
}) => {
  const total = likes + dislikes
  const likesPercent = total ? Number((likes / total).toFixed(4)) : 0

  return (
    <ReactionStepperWrapper className={className}>
      <ReactionButton state={state} onReact={onLike} type="like" reactionsNumber={likes} />
      <ReactionButton state={state} onReact={onDislike} type="dislike" reactionsNumber={dislikes} />
      <ReactionBar loaded={state !== 'loading'}>
        <ReactionBarProgress likesPercent={likesPercent} isProcessing={state === 'processing'} />
      </ReactionBar>
    </ReactionStepperWrapper>
  )
}
