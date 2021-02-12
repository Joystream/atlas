import React from 'react'
import Dialog from '../GeneralDialog/GeneralDialog'
import { DialogProps } from '@/components/Dialogs/GeneralDialog/GeneralDialog'
import {
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
  element: JSX.Element
}

type MultistepperProps = {
  steps: Step[]
  currentStep?: number
} & DialogProps

const Multistepper: React.FC<MultistepperProps> = ({
  steps,
  currentStep = 0,
  exitButton,
  handleExit,
  ...dialogProps
}) => {
  return (
    <Dialog wide {...dialogProps}>
      <StyledHeader>
        <StyledStepsInfoContainer>
          {steps.map((step, idx) => (
            <StyledStepInfo key={step.title}>
              <StyledCircle isFilled={idx === currentStep || currentStep > idx}>
                {currentStep > idx ? <Icon name="check" /> : idx + 1}
              </StyledCircle>
              <StyledStepInfoText isActive={idx === currentStep}>{step.title}</StyledStepInfoText>
              {idx === steps.length - 1 ? null : <hr />}
            </StyledStepInfo>
          ))}
        </StyledStepsInfoContainer>
        {exitButton && (
          <StyledExitButton aria-label="close dialog" onClick={handleExit}>
            <Icon name="times" />
          </StyledExitButton>
        )}
      </StyledHeader>
      {steps[currentStep].element}
    </Dialog>
  )
}

export default Multistepper
