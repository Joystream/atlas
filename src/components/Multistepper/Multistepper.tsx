import React, { Fragment } from 'react'

import { Step } from '@/shared/components/Step'

import { StyledChevron, StyledDialog, StyledHeader, StyledStepsInfoContainer } from './Multistepper.style'

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
              <Fragment key={idx}>
                <Step title={step.title} number={idx + 1} active={isActive} completed={isCompleted} />
                {!isLast && <StyledChevron />}
              </Fragment>
            )
          })}
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledDialog>
  )
}
