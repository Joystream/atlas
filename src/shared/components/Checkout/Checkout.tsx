import React from 'react'
import styled from '@emotion/styled'
import { colors } from '@/shared/theme'
import CircularProgressbar from '../CircularProgressbar'
import Text from '../Text'
import Icon from '../Icon'

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
          <Text variant="body2">
            {stepsCompletedNumber}/{steps.length}
          </Text>
        </StepsProgressContainer>
      </TopRowContainer>
      <StepsContainer>
        {steps.map((step, idx) => (
          <Step key={step.title + idx} onClick={step.onClick}>
            <StepState completed={step.completed}>{step.completed && <CheckIcon name="check" />}</StepState>{' '}
            <Text variant="body2">{step.title}</Text>)
          </Step>
        ))}
      </StepsContainer>
    </Container>
  )
}

export default Checkout

const Container = styled.div`
  padding: 24px;
  width: 312px;
  background-color: #181c20;
  color: ${colors.white};
`

const ProgressbarContainer = styled.div`
  width: 24px;
  height: 24px;
`

const StepsProgressContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const TopRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

type StepStateProps = {
  completed: boolean
}
const StepState = styled.div<StepStateProps>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  ${({ completed }) => [
    completed &&
      `background-color: #4038FF;
      border: 2px solid transparent;`,
    completed === false && `border: 2px solid #7B8A95`,
  ]};
`

const Step = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const CheckIcon = styled(Icon)`
  position: relative;
  top: 1px;
`
export const StyledPlayIcon = ({ ...svgProps }) => <CheckIcon name="check" {...svgProps} />
