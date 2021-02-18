import React from 'react'
import { DialogProps } from '../GeneralDialog/GeneralDialog'
import {
  StyledDialog,
  StyledHeader,
  StyledStepsInfoContainer,
  StyledStepInfo,
  StyledCircle,
  StyledStepInfoText,
} from './Multistepper.style'
import { Icon } from '@/shared/components'

type Step = {
  title: string
  element: React.ReactNode
}

type MultistepperProps = {
  steps: Step[]
  currentStepIdx?: number
} & DialogProps

const Multistepper: React.FC<MultistepperProps> = ({ steps, currentStepIdx = 0, ...dialogProps }) => {
  return (
    <StyledDialog {...dialogProps}>
      <StyledHeader>
        <StyledStepsInfoContainer>
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIdx
            const isCompleted = currentStepIdx > idx
            const isLast = idx === steps.length - 1

            return (
              <StyledStepInfo key={step.title} isActive={isActive}>
                <StyledCircle isFilled={isActive || isCompleted}>
                  {isCompleted ? <Icon name="check" /> : idx + 1}
                </StyledCircle>
                <StyledStepInfoText isActive={isActive}>{step.title}</StyledStepInfoText>
                {isLast ? null : <hr />}
              </StyledStepInfo>
            )
          })}
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledDialog>
  )
}

export default Multistepper
