import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgGlyphCheck, SvgGlyphChevronRight } from '@/icons'
import { transitions } from '@/theme'

import {
  BottomRowContainer,
  CircularProgresaBarContainer,
  Container,
  Step,
  StepInnerContainer,
  StepState,
  StepsCompletedText,
  StepsContainer,
  StepsProgressContainer,
  StyledCircularProgress,
  StyledSvgGlyphChevronDown,
} from './ProgressDrawer.styles'

import { IconButton } from '../IconButton'
import { Text } from '../Text'

export type Step = { title: string; onClick: () => void; completed: boolean }
export type ProgressDrawerProps = {
  steps: Step[]
  className?: string
}
export const ProgressDrawer: React.FC<ProgressDrawerProps> = ({ steps, className }) => {
  const stepsCompletedNumber = steps.filter(({ completed }) => completed).length
  const [isHidden, setIsHidden] = useState(false)
  return (
    <Container className={className}>
      <StepsContainer isHidden={isHidden}>
        {steps.map((step, idx) => (
          <Step completed={step.completed} key={step.title + idx} onClick={() => !step.completed && step.onClick()}>
            <StepInnerContainer>
              <StepState completed={step.completed}>
                <CSSTransition in={step.completed} timeout={100} classNames={transitions.names.fade} unmountOnExit>
                  <SvgGlyphCheck />
                </CSSTransition>
              </StepState>
              <Text variant="body2">{step.title}</Text>
            </StepInnerContainer>
            <CSSTransition in={!step.completed} timeout={100} classNames={transitions.names.fade} unmountOnExit>
              <SvgGlyphChevronRight />
            </CSSTransition>
          </Step>
        ))}
      </StepsContainer>
      <BottomRowContainer>
        <StepsProgressContainer>
          <CircularProgresaBarContainer>
            <StyledCircularProgress value={stepsCompletedNumber} maxValue={steps.length} />
            <StepsCompletedText variant="body2">
              {stepsCompletedNumber}/{steps.length}
            </StepsCompletedText>
          </CircularProgresaBarContainer>
          <IconButton variant="secondary" onClick={() => setIsHidden(!isHidden)} size="small">
            <StyledSvgGlyphChevronDown isHidden={isHidden} />
          </IconButton>
        </StepsProgressContainer>
      </BottomRowContainer>
    </Container>
  )
}
