import React from 'react'
import { BaseDialogProps } from '../BaseDialog'
import {
  StyledDialog,
  StyledHeader,
  StyledStepsInfoContainer,
  StyledStepInfo,
  StyledCircle,
  StyledStepInfoText,
  StyledChevron,
  StyledStepTitle,
} from './Multistepper.style'
import { SvgGlyphCheck, SvgGlyphChevronRight } from '@/shared/icons'
import { Text } from '@/shared/components'

type Step = {
  title: string
  element: React.ReactNode
}

type MultistepperProps = {
  steps: Step[]
  currentStepIdx?: number
} & BaseDialogProps

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
              <>
                <StyledStepInfo key={step.title} isActive={isActive}>
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
              </>
            )
          })}
        </StyledStepsInfoContainer>
      </StyledHeader>
      {steps[currentStepIdx].element}
    </StyledDialog>
  )
}

export default Multistepper
