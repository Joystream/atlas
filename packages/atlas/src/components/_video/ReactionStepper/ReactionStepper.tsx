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
  const [shouldRunLikeAnimation, setShouldRunLikeAnimation] = useState(false)
  const [shouldRunDislikeAnimation, setShouldRunDislikeAnimation] = useState(false)
  const total = likes + dislikes
  const likesPercent = total ? Number((likes / total).toFixed(4)) : 0

  const handleLike = () => {
    if (state === 'liked') {
      return
    }
    setShouldRunLikeAnimation(true)
    onLike?.()
  }
  const handleDislike = () => {
    if (state === 'disliked') {
      return
    }
    setShouldRunDislikeAnimation(true)
    onDislike?.()
  }

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
              onClick={handleLike}
              onAnimationEnd={() => setShouldRunLikeAnimation(false)}
              variant="tertiary"
              icon={
                state === 'liked' ? (
                  <StyledSvgActionLikeSolid shouldRunAnimation={shouldRunLikeAnimation} />
                ) : (
                  <SvgActionLikeOutline />
                )
              }
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
          timeout={parseInt(cVar('animationTimingFast', true))}
        >
          {state === 'loading' ? (
            <ReactionButtonLoader />
          ) : (
            <Button
              onClick={handleDislike}
              onAnimationEnd={() => setShouldRunDislikeAnimation(false)}
              variant="tertiary"
              disabled={state === 'processing'}
              icon={
                state === 'disliked' ? (
                  <StyledSvgActionDislikeSolid shouldRunAnimation={shouldRunDislikeAnimation} />
                ) : (
                  <SvgActionDislikeOutline />
                )
              }
            >
              <ReactionsCounter type="dislike" state={state} variant="t200">
                {formatNumberShort(dislikes)}
              </ReactionsCounter>
            </Button>
          )}
        </CSSTransition>
      </SwitchTransition>
      <ReactionBar loaded={state !== 'loading'}>
        <ReactionBarProgress likesPercent={likesPercent} isProcessing={state === 'processing'} />
      </ReactionBar>
    </ReactionStepperWrapper>
  )
}

const ReactionButtonLoader: React.FC = () => {
  return (
    <LoadingWrapper>
      <SkeletonLoader rounded width={16} height={16} /> <SkeletonLoader height={20} width={32} />
    </LoadingWrapper>
  )
}
