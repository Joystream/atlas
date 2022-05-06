import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { Tooltip } from '@/components/Tooltip'
import { cVar, sizes } from '@/styles'

export const ReactionStepperWrapper = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  row-gap: ${sizes(5.5)};
  min-width: 155px;
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
  from {
    transform: translateX(-50%) scaleX(50%);
  }
  to {
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
          ${reactionBarAnimation} 1000ms ease-in-out infinite
        `
      : 'none'};
`

export const StyledTooltip = styled(Tooltip)`
  position: absolute;
`
