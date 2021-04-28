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
          <Step key={step.title + idx} onClick={step.onClick}>
            <StepInnerContainer>
              <StepState completed={step.completed}>{step.completed && <SvgGlyphCheck />}</StepState>{' '}
              <Text variant="body2">{step.title}</Text>
            </StepInnerContainer>
            <SvgGlyphChevronRight />
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
          <IconButton variant="secondary" onClick={() => setIsHidden(!isHidden)}>
            <StyledSvgGlyphChevronDown isHidden={isHidden} />
          </IconButton>
        </StepsProgressContainer>
      </BottomRowContainer>
    </Container>
  )
}

export default Checkout
