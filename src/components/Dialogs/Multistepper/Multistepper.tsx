import React from 'react'

import { Stepper } from '@/shared/components'

import { StyledDialog, StyledHeader, StyledStepsInfoContainer } from './Multistepper.style'

import { BaseDialogProps } from '../BaseDialog'

type Step = {
  title: string
  element: React.ReactNode
}

type MultistepperProps = {
  steps: Step[]
  currentStepIdx?: number
} & BaseDialogProps

export const Multistepper: React.FC<MultistepperProps> = ({ steps, currentStepIdx = 0, ...dialogProps }) => {
  return (
    <StyledDialog {...dialogProps}>
      <StyledHeader>
        <StyledStepsInfoContainer>
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIdx
            const isCompleted = currentStepIdx > idx
            const isLast = idx === steps.length - 1

            return (
              <Stepper
                key={idx}
                withChevron={!isLast}
                title={step.title}
                number={idx + 1}
                active={isActive}
                completed={isCompleted}
              />
            )
          })}
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledDialog>
  )
}
