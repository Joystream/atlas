import React, { useState } from 'react'
import Text from '../Text'
import {
  Container,
  BottomRowContainer,
  StepsProgressContainer,
  StepsContainer,
  Step,
  StepInnerContainer,
  StepState,
  StepsCompletedText,
  StyledCircularProgressbar,
  CircularProgresaBarContainer,
  StyledSvgGlyphChevronDown,
} from './Checkout.styles'
import { SvgGlyphCheck, SvgGlyphChevronRight } from '@/shared/icons'
import IconButton from '../IconButton'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'

export type Step = { title: string; onClick: () => void; completed: boolean }
export type CheckoutProps = {
  steps: Step[]
  className?: string
}
export const Checkout: React.FC<CheckoutProps> = ({ steps, className }) => {
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
            <StyledCircularProgressbar value={stepsCompletedNumber} maxValue={steps.length} />
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

export default Checkout
