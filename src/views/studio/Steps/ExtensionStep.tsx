import React from 'react'
import { BrowserIcon } from './ExtensionStep.style'
import { StepButton, StepSubTitle, StepTitle, StepWrapper } from '../SignInView/SignInView.style'

type ExtensionStepProps = {
  browser: 'chrome' | 'firefox' | null
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

const ExtensionStep: React.FC<ExtensionStepProps> = ({ browser, currentStepIdx, onStepChange }) => {
  return (
    <StepWrapper centered>
      {browser && <BrowserIcon name={browser} />}
      <StepTitle variant="h4">Add polkadot extension</StepTitle>
      <StepSubTitle variant="body2">
        Please enable Polkadot extension or install it using one of the following plugin links.
      </StepSubTitle>
      {browser && (
        <StepButton icon={browser} onClick={() => onStepChange(currentStepIdx + 1)}>
          Add polkadot plugin
        </StepButton>
      )}
    </StepWrapper>
  )
}

export default ExtensionStep
