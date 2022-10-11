import isPropValid from '@emotion/is-prop-valid'
import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionDislikeSolid, SvgActionLikeSolid } from '@/assets/icons'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const LoadingWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding: ${sizes(2.5)} ${sizes(4)};
  align-items: center;
  gap: ${sizes(2)};
`

// proccessing means that there is ongoing transaction
export type ReactionSteppperState = 'liked' | 'disliked' | 'default' | 'loading' | 'processing'

type ReactionsCounterProps = {
  type: 'like' | 'dislike'
  disabled?: boolean
  state: ReactionSteppperState
}

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

export const StyledSvgActionLikeSolid = styled(SvgActionLikeSolid, { shouldForwardProp: isPropValid })<{
  shouldRunAnimation: boolean
}>`
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

export const StyledSvgActionDislikeSolid = styled(SvgActionDislikeSolid, { shouldForwardProp: isPropValid })<{
  shouldRunAnimation: boolean
}>`
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

export const getCounterColor = ({ state, type, disabled }: ReactionsCounterProps) => {
  if (disabled) {
    return cVar('colorTextStrong')
  }
  switch (state) {
    case 'liked':
      return cVar(`colorText${type === 'like' ? 'Primary' : 'Strong'}`)
    case 'disliked':
      return cVar(`colorText${type === 'dislike' ? 'Error' : 'Strong'}`)
    default:
      return cVar('colorTextStrong')
  }
}

export const ReactionsCounter = styled(Text)<ReactionsCounterProps>`
  color: ${getCounterColor};
`
