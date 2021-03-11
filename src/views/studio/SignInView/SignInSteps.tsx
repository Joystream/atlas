import React, { useState } from 'react'
import { BrowserIcon, StepButton, StepSubTitle, StepTitle, StepWrapper } from './SignInSteps.style'

type CommonStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

type ExtensionStepProps = {
  browser: 'chrome' | 'firefox' | null
} & CommonStepProps

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

type Account = {
  name: string
  img: string
  balance: number
}

const AccountStep = () => {
  const [accounts, checkAccounts] = useState<null | Account[]>()
  return (
    <StepWrapper>
      <StepTitle variant="h4">Waiting for account creation</StepTitle>
    </StepWrapper>
  )
}

const TermsStep = () => {
  return <div>This will be terms and condition</div>
}

export { ExtensionStep, AccountStep, TermsStep }
