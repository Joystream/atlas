import React, { useState } from 'react'

import { ReactionButton } from './ReactionButton'
import { ReactionSteppperState } from './ReactionButton/ReactionButton.styles'
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const total = likes + dislikes
  const likesPercent = total ? Number((likes / total).toFixed(4)) : 0

  return (
    <ReactionStepperWrapper className={className}>
      <ReactionButton
        state={state}
        onReact={onLike}
        type="like"
        reactionsNumber={likes}
        onPopoverShow={() => setIsPopoverOpen(true)}
        onPopoverHide={() => setIsPopoverOpen(false)}
        isPopoverOpen={isPopoverOpen}
      />
      <ReactionButton
        state={state}
        onReact={onDislike}
        type="dislike"
        reactionsNumber={dislikes}
        onPopoverShow={() => setIsPopoverOpen(true)}
        onPopoverHide={() => setIsPopoverOpen(false)}
        isPopoverOpen={isPopoverOpen}
      />
      <ReactionBar loaded={state !== 'loading'}>
        <ReactionBarProgress likesPercent={likesPercent} isProcessing={state === 'processing' || isPopoverOpen} />
      </ReactionBar>
    </ReactionStepperWrapper>
  )
}
