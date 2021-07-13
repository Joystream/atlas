import React, { Fragment } from 'react'

import { Text } from '@/shared/components'
import { SvgGlyphCheck } from '@/shared/icons'

import {
  StyledChevron,
  StyledCircle,
  StyledDialog,
  StyledHeader,
  StyledStepInfo,
  StyledStepInfoText,
  StyledStepTitle,
  StyledStepsInfoContainer,
} from './Multistepper.style'

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
                <StyledStepInfo isActive={isActive}>
                  <StyledCircle isFilled={isActive || isCompleted} isActive={isActive}>
                    {isCompleted ? <SvgGlyphCheck /> : idx + 1}
                  </StyledCircle>
                  <StyledStepInfoText isActive={isActive}>
                    <Text variant="caption" secondary>
                      Step {idx + 1}
                    </Text>
                    <StyledStepTitle variant="overhead">{step.title}</StyledStepTitle>
                  </StyledStepInfoText>
                </StyledStepInfo>
                {isLast ? null : <StyledChevron />}
              </Fragment>
            )
          })}
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledDialog>
  )
}
