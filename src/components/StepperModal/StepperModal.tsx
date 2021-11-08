import React, { Fragment } from 'react'

import { IconButton } from '@/components/IconButton'
import { Step } from '@/components/Step'
import { SvgGlyphClose } from '@/components/icons'

import { StyledChevron, StyledHeader, StyledModal, StyledStepsInfoContainer, StyledStop } from './StepperModal.style'

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
            <SvgGlyphClose />
          </IconButton>
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledModal>
  )
}
