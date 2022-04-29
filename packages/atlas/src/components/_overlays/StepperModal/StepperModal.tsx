import { ClassNames } from '@emotion/react'
import React, { Fragment } from 'react'

import { Step, getStepVariant } from '@/components/Step'
import { Button } from '@/components/_buttons/Button'
import { SvgActionClose } from '@/components/_icons'

import {
  StyledChevron,
  StyledHeader,
  StyledModal,
  StyledStepsInfoContainer,
  StyledStop,
  dialogContentCss,
} from './StepperModal.styles'

import { DialogModalProps } from '../DialogModal'

type Step = {
  title: string
  element: React.ReactNode
}

type StepperModalProps = {
  steps: Step[]
  currentStepIdx?: number
  onExitClick?: () => void
} & DialogModalProps

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
    <ClassNames>
      {({ css }) => (
        <StyledModal {...modalProps} contentClassName={css(dialogContentCss)} noContentPadding size="medium">
          <StyledHeader>
            <StyledStepsInfoContainer>
              {steps.map((step, idx) => {
                const stepVariant = getStepVariant(currentStepIdx, idx)
                const isLast = idx === steps.length - 1

                return (
                  <Fragment key={idx}>
                    <StyledStop title={step.title} number={idx + 1} variant={stepVariant} />
                    {!isLast && <StyledChevron />}
                  </Fragment>
                )
              })}
              <Button
                iconOnly
                icon={<SvgActionClose />}
                onClick={onExitClick}
                aria-label="close modal"
                variant="tertiary"
              />
            </StyledStepsInfoContainer>
          </StyledHeader>
          {steps[currentStepIdx].element}
        </StyledModal>
      )}
    </ClassNames>
  )
}
