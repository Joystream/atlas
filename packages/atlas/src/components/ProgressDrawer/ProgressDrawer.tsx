import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionCheck, SvgActionChevronR } from '@/components/_icons'
import { transitions } from '@/styles'

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
                  <SvgActionCheck />
                </CSSTransition>
              </StepState>
              <Text variant="t200">{step.title}</Text>
            </StepInnerContainer>
            <CSSTransition in={!step.completed} timeout={100} classNames={transitions.names.fade} unmountOnExit>
              <SvgActionChevronR />
            </CSSTransition>
          </Step>
        ))}
      </StepsContainer>
      <BottomRowContainer>
        <StepsProgressContainer>
          <CircularProgresaBarContainer>
            <StyledCircularProgress value={stepsCompletedNumber} maxValue={steps.length} />
            <StepsCompletedText variant="t200">
              {stepsCompletedNumber}/{steps.length}
            </StepsCompletedText>
          </CircularProgresaBarContainer>
          <Button
            icon={<StyledSvgGlyphChevronDown isHidden={isHidden} />}
            variant="secondary"
            onClick={() => setIsHidden(!isHidden)}
            size="small"
          />
        </StepsProgressContainer>
      </BottomRowContainer>
    </Container>
  )
}
