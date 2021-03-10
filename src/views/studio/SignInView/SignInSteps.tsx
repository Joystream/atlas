import { Button } from '@/shared/components'
import React from 'react'
import { ChromeIcon, StepButton, StepSubTitle, StepTitle, StepWrapper } from './SignInSteps.style'

const AddPolkaDot = () => {
  return (
    <StepWrapper>
      <ChromeIcon name="chrome" />
      <StepTitle variant="h4">Add polkadot extension</StepTitle>
      <StepSubTitle variant="body2">
        Please enable Polkadot extension or install it using one of the following plugin links.
      </StepSubTitle>
      <StepButton>Add polkadot plugin</StepButton>
    </StepWrapper>
  )
}

const CreateOrSelectAccount = () => {
  return <div>Show this if there is no account</div>
}

const TermsAndConditions = () => {
  return <div>This will be terms and condition</div>
}

export { AddPolkaDot, CreateOrSelectAccount, TermsAndConditions }
