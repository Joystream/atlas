import React, { useRef, useState } from 'react'

import { ReactionButton, ReactionSteppperState } from './ReactionButton'
import { ReactionBar, ReactionBarProgress, ReactionStepperWrapper, StyledTooltip } from './ReactionStepper.styles'

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
  const reactionStepperWrapperRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {state === 'processing' && (
        <StyledTooltip
          text="Your reaction is being processed"
          placement="top"
          oneLine
          reference={reactionStepperWrapperRef.current}
        />
      )}
      <ReactionStepperWrapper className={className} ref={reactionStepperWrapperRef}>
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
    </>
  )
}
