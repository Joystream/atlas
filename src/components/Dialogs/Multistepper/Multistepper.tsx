import React from 'react'
import Dialog, { DialogProps } from '../GeneralDialog/GeneralDialog'
import {
  StyledDialog,
  StyledHeader,
  StyledStepsInfoContainer,
  StyledStepInfo,
  StyledCircle,
  StyledStepInfoText,
  StyledExitButton,
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

const Multistepper: React.FC<MultistepperProps> = ({
  steps,
  currentStepIdx = 0,
  exitButton,
  handleExit,
  ...dialogProps
}) => {
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
        {exitButton && (
          <StyledExitButton aria-label="close dialog" onClick={handleExit}>
            <Icon name="times" />
          </StyledExitButton>
        )}
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledDialog>
  )
}

export default Multistepper
