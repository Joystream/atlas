import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { CircularProgress } from '@/components/CircularProgress'
import { Text } from '@/components/Text'
import { SvgActionChevronB } from '@/components/_icons'
import { cVar, sizes, transitions } from '@/styles'

export const Container = styled.div`
  width: 280px;
  overflow-y: hidden;
`
export const CircularProgresaBarContainer = styled.div`
  display: flex;
  align-items: center;
`

export const StyledCircularProgress = styled(CircularProgress)`
  margin-left: ${sizes(2)};
  margin-right: ${sizes(2)};
  width: ${sizes(6)};
  height: ${sizes(6)};
`

export const StepsProgressContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const BottomRowContainer = styled.div`
  padding: ${sizes(4)};
  background-color: ${cVar('colorCoreNeutral800')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`

type StepsContainerProps = {
  isHidden?: boolean
}

export const StepsContainer = styled.div<StepsContainerProps>`
  display: grid;
  grid-auto-flow: row;
  padding: ${sizes(4)};
  transform: translateY(${({ isHidden }) => (isHidden ? '150%' : '0%')});
  background-color: ${cVar('colorCoreNeutral800')};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  position: relative;
  z-index: 1;
`

export const StyledSvgGlyphChevronDown = styled(SvgActionChevronB, {
  shouldForwardProp: isPropValid,
})<StepsContainerProps>`
  transform: rotate(${({ isHidden }) => (isHidden ? '-180deg' : '0deg')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`

type StepStateProps = {
  completed: boolean
}
export const StepState = styled.div<StepStateProps>`
  width: ${sizes(6)};
  height: ${sizes(6)};
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  ${({ completed }) => [
    completed &&
      `background-color: ${cVar('colorCoreBlue500')};
    border: 2px solid transparent;`,
    completed === false && `border: 2px solid ${cVar('colorCoreNeutral300')}`,
  ]};
`

export const Step = styled.div<StepStateProps>`
  cursor: ${({ completed }) => (completed ? 'initial' : 'pointer')};
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(2)};
  margin-bottom: ${sizes(2)};

  :last-of-type {
    position: relative;

    ::after {
      bottom: -${sizes(4)};
      position: absolute;
      content: '';
      width: 100%;
      height: 1px;
      background-color: ${cVar('colorCoreNeutral300')};
    }
  }

  :hover {
    background-color: ${({ completed }) => !completed && cVar('colorCoreNeutral700Lighten')};
  }
`

export const StepsCompletedText = styled(Text)`
  min-width: 25px;
  text-align: right;
`
export const StepInnerContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${sizes(3)};
  align-items: center;
`
