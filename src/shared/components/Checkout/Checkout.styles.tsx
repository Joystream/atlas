import styled from '@emotion/styled'

import { SvgGlyphChevronDown } from '@/shared/icons'
import { colors, sizes, transitions } from '@/shared/theme'

import CircularProgressbar from '../CircularProgressbar'
import Text from '../Text'

export const Container = styled.div`
  width: 280px;
  overflow-y: hidden;
`
export const CircularProgresaBarContainer = styled.div`
  display: flex;
  align-items: center;
`

export const StyledCircularProgressbar = styled(CircularProgressbar)`
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
  background-color: ${colors.gray[800]};
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
  background-color: ${colors.gray[800]};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  position: relative;
  z-index: 1;
`

export const StyledSvgGlyphChevronDown = styled(SvgGlyphChevronDown)<StepsContainerProps>`
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
      `background-color: ${colors.blue[500]};
    border: 2px solid transparent;`,
    completed === false && `border: 2px solid ${colors.gray[300]}`,
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
      background-color: ${colors.gray[300]};
    }
  }

  :hover {
    background-color: ${({ completed }) => !completed && colors.transparentPrimary[18]};
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
