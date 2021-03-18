import React from 'react'
import CircularProgressbar from '../CircularProgressbar'
import Text from '../Text'
import {
  Container,
  TopRowContainer,
  StepsProgressContainer,
  ProgressbarContainer,
  StepsContainer,
  Step,
  StepInnerContainer,
  StepState,
  CheckIcon,
  ChecvronIcon,
  StepsCompletedText,
} from './Checkout.styles'

export type Step = { title: string; onClick: () => void; completed: boolean }
export type CheckoutProps = {
  steps: Step[]
}
export const Checkout: React.FC<CheckoutProps> = ({ steps }) => {
  const stepsCompletedNumber = steps.filter(({ completed }) => completed).length
  return (
    <Container>
      <TopRowContainer>
        <Text variant="h6">Progress</Text>
        <StepsProgressContainer>
          <ProgressbarContainer>
            <CircularProgressbar value={stepsCompletedNumber} maxValue={steps.length}></CircularProgressbar>
          </ProgressbarContainer>
          <StepsCompletedText variant="body2">
            {stepsCompletedNumber}/{steps.length}
          </StepsCompletedText>
        </StepsProgressContainer>
      </TopRowContainer>
      <StepsContainer>
        {steps.map((step, idx) => (
          <Step key={step.title + idx} onClick={step.onClick}>
            <StepInnerContainer>
              <StepState completed={step.completed}>{step.completed && <CheckIcon name="check" />}</StepState>{' '}
              <Text variant="body2">{step.title}</Text>
            </StepInnerContainer>
            <ChecvronIcon />
          </Step>
        ))}
      </StepsContainer>
    </Container>
  )
}

export default Checkout
