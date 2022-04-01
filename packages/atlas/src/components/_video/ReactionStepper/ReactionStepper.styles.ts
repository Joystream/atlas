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
`

export const ReactionBarProgress = styled.div<{ likesPercent: number }>`
  width: 100%;
  height: 100%;
  transform: scaleX(${({ likesPercent }) => likesPercent});
  transform-origin: left;
  background-color: ${cVar('colorText')};
`

export const StyledSvgActionLikeSolid = styled(SvgActionLikeSolid)`
  path {
    fill: ${cVar('colorTextPrimary')};
  }
`

export const StyledSvgActionDislikeSolid = styled(SvgActionDislikeSolid)`
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
