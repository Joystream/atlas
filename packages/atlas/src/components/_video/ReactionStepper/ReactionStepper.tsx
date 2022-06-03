import React, { useRef, useState } from 'react'

import { VideoReaction } from '@/joystream-lib'

import { ReactionButton, ReactionSteppperState } from './ReactionButton'
import { ReactionBar, ReactionBarProgress, ReactionStepperWrapper, StyledTooltip } from './ReactionStepper.styles'

export type ReactionStepperProps = {
  likes?: number
  dislikes?: number
  state: ReactionSteppperState
  className?: string
  reactionPopoverDismissed?: boolean
  onReact: (reaction: VideoReaction) => Promise<boolean>
}

export const ReactionStepper: React.FC<ReactionStepperProps> = ({
  likes = 0,
  dislikes = 0,
  state,
  className,
  reactionPopoverDismissed,
  onReact,
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
          reactionPopoverDismissed={reactionPopoverDismissed}
          onReact={onReact}
          type="like"
          reactionsNumber={likes}
          onPopoverShow={() => setIsPopoverOpen(true)}
          onPopoverHide={() => setIsPopoverOpen(false)}
          isPopoverOpen={isPopoverOpen}
        />
        <ReactionButton
          state={state}
          reactionPopoverDismissed={reactionPopoverDismissed}
          onReact={onReact}
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
