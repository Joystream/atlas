import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Button } from '@/components/_buttons/Button'
import { SvgActionDislikeOutline, SvgActionLikeOutline } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'

import {
  LoadingWrapper,
  ReactionBar,
  ReactionBarProgress,
  ReactionStepperWrapper,
  ReactionsCounter,
  StyledSvgActionDislikeSolid,
  StyledSvgActionLikeSolid,
} from './ReactionStepper.styles'

// proccessing means that there is ongoing transaction
export type ReactionSteppperState = 'liked' | 'disliked' | 'default' | 'loading' | 'processing'

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
  const [loaded, setLoaded] = useState(false)
  const total = likes + dislikes
  const likesPercent = total ? Number((likes / total).toFixed(4)) : 0

  return (
    <ReactionStepperWrapper>
      <SwitchTransition>
        <CSSTransition
          key={(state === 'loading').toString()}
          classNames={transitions.names.fade}
          timeout={parseInt(cVar('animationTimingFast', true))}
        >
          {state === 'loading' ? (
            <ReactionButtonLoader />
          ) : (
            <Button
              disabled={state === 'processing'}
              onClick={onLike}
              variant="tertiary"
              icon={state === 'liked' ? <StyledSvgActionLikeSolid /> : <SvgActionLikeOutline />}
            >
              <ReactionsCounter type="like" state={state} variant="t200">
                {formatNumberShort(likes)}
              </ReactionsCounter>
            </Button>
          )}
        </CSSTransition>
      </SwitchTransition>
      <SwitchTransition>
        <CSSTransition
          key={(state === 'loading').toString()}
          classNames={transitions.names.fade}
          // we want to delay the animation of the progress bar to avoid layout shifts
          onExited={() => state === 'loading' && setLoaded(state === 'loading')}
          onExit={() => state !== 'loading' && setLoaded(false)}
          timeout={parseInt(cVar('animationTimingFast', true))}
        >
          {state === 'loading' ? (
            <ReactionButtonLoader />
          ) : (
            <Button
              onClick={onDislike}
              variant="tertiary"
              disabled={state === 'processing'}
              icon={state === 'disliked' ? <StyledSvgActionDislikeSolid /> : <SvgActionDislikeOutline />}
            >
              <ReactionsCounter type="dislike" state={state} variant="t200">
                {formatNumberShort(dislikes)}
              </ReactionsCounter>
            </Button>
          )}
        </CSSTransition>
      </SwitchTransition>
      <ReactionBar loaded={loaded}>
        <ReactionBarProgress likesPercent={likesPercent} />
      </ReactionBar>
    </ReactionStepperWrapper>
  )
}

const ReactionButtonLoader: React.FC = () => {
  return (
    <LoadingWrapper>
      <SkeletonLoader rounded width={16} height={16} /> <SkeletonLoader height={20} width={32} />{' '}
    </LoadingWrapper>
  )
}
