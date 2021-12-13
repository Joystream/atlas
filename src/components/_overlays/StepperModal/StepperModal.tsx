import React, { Fragment } from 'react'

import { Step } from '@/components/Step'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose } from '@/components/_icons'

import { StyledChevron, StyledHeader, StyledModal, StyledStepsInfoContainer, StyledStop } from './StepperModal.styles'

import { ModalProps } from '../Modal'

type Step = {
  title: string
  element: React.ReactNode
}

type StepperModalProps = {
  steps: Step[]
  currentStepIdx?: number
  onExitClick?: () => void
} & ModalProps

export const StepperModal: React.FC<StepperModalProps> = ({
  steps,
  currentStepIdx = 0,
  onExitClick,
  ...modalProps
}) => {
  if (isNaN(currentStepIdx)) {
    return null
  }
  return (
    <StyledModal {...modalProps}>
      <StyledHeader>
        <StyledStepsInfoContainer>
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIdx
            const isCompleted = currentStepIdx > idx
            const isLast = idx === steps.length - 1

            return (
              <Fragment key={idx}>
                <StyledStop title={step.title} number={idx + 1} active={isActive} completed={isCompleted} />
                {!isLast && <StyledChevron />}
              </Fragment>
            )
          })}
          <IconButton aria-label="close modal" onClick={onExitClick} variant="tertiary">
            <SvgActionClose />
          </IconButton>
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledModal>
  )
}
