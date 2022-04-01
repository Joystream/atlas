import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgActionDislikeSolid, SvgActionLikeSolid } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

import { ReactionSteppperState } from './ReactionStepper'

export const ReactionStepperWrapper = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  row-gap: ${sizes(5.5)};
  min-width: 155px;
`

export const LoadingWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding: ${sizes(2.5)} ${sizes(4)};
  align-items: center;
  gap: ${sizes(2)};
`

export const ReactionBar = styled.div<{ loaded: boolean }>`
  width: 100%;
  grid-column: span 2;
  height: 2px;
  opacity: ${({ loaded }) => (loaded ? 1 : 0)};
  background-color: ${cVar('colorCoreNeutral700')};
  transition: ${cVar('animationTransitionFast')};
  overflow-x: hidden;
  transition-delay: ${({ loaded }) => (loaded ? cVar('animationTimingFast') : '0')};
`

const reactionBarAnimation = keyframes`
  0% {
    transform: translateX(-50%) scaleX(50%);
  }
  50% {
    transform: translateX(50%) scaleX(50%);
  }
  100% {
    transform: translateX(100%) scaleX(50%);
  }
`

export const ReactionBarProgress = styled.div<{ likesPercent: number; isProcessing: boolean }>`
  width: 100%;
  height: 100%;
  transform: scaleX(${({ likesPercent }) => likesPercent});
  transform-origin: left;
  background-color: ${cVar('colorText')};
  transition: transform ${cVar('animationTransitionFast')};
  animation: ${({ isProcessing }) =>
    isProcessing
      ? css`
          ${reactionBarAnimation} 1000ms cubic-bezier(0, 0, 0.5, 1) 1ms infinite
        `
      : 'none'};
`

const bounceKeyframes = (isLike: boolean) => keyframes`
  from,
  20%,
  53%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -12px, 0) scaleY(1.4) scaleX(1.3) rotate(${isLike ? '-' : ''}15deg);
  }

  75% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -6px, 0) scaleY(1.2) scaleX(1.1) rotate(${isLike ? '' : '-'}10deg);
  }

  80% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0) scaleY(0.95) rotate(${isLike ? '-' : ''}5deg);
  }

  90% {
    transform: translate3d(0, -4px, 0) scaleY(1.05) rotate(${isLike ? '' : '-'}deg);
  }
`

export const StyledSvgActionLikeSolid = styled(SvgActionLikeSolid)<{ shouldRunAnimation: boolean }>`
  ${({ shouldRunAnimation }) =>
    shouldRunAnimation &&
    css`
      animation-name: ${bounceKeyframes(true)};
      transform-origin: center bottom;
      animation-duration: 0.75s;
    `}
  path {
    fill: ${cVar('colorTextPrimary')};
  }
`

export const StyledSvgActionDislikeSolid = styled(SvgActionDislikeSolid)<{ shouldRunAnimation: boolean }>`
  ${({ shouldRunAnimation }) =>
    shouldRunAnimation &&
    css`
      animation-name: ${bounceKeyframes(false)};
      transform-origin: center bottom;
      animation-duration: 0.75s;
    `}
  path {
    fill: ${cVar('colorTextError')};
  }
`

type ReactionsCounterProps = {
  type: 'like' | 'dislike'
  state: ReactionSteppperState
}
export const getCounterColor = ({ state, type }: ReactionsCounterProps) => {
  switch (state) {
    case 'liked':
      return cVar(`colorText${type === 'like' ? 'Primary' : 'Strong'}`)
    case 'disliked':
      return cVar(`colorText${type === 'dislike' ? 'Error' : 'Strong'}`)
    case 'default':
    default:
      return cVar('colorTextStrong')
  }
}

export const ReactionsCounter = styled(Text)<ReactionsCounterProps>`
  color: ${getCounterColor}; ;
`
