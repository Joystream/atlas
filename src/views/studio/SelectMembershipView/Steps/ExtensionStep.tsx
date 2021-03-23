import { Text } from '@/shared/components'
import React from 'react'
import { BrowserIcon, RefreshText, StyledButton } from './ExtensionStep.style'
import { StepTitle, StepSubTitle, StepWrapper } from './Steps.style'

type ExtensionStepProps = {
  browser: 'chrome' | 'firefox' | null
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

const ExtensionStep: React.FC<ExtensionStepProps> = ({ browser, onStepChange, currentStepIdx }) => {
  const handleChangeStep = () => {
    window.location.reload()
    // TODO Need to change
    // let's just assume for now that after refreshing page user has polkadot installed
    onStepChange(currentStepIdx + 1)
  }
  return (
    <StepWrapper centered>
      {browser && <BrowserIcon name={browser} />}
      <StepTitle variant="h4">Add polkadot extension</StepTitle>
      <StepSubTitle variant="body2">
        Please enable Polkadot extension or install it using one of the following plugin links.
      </StepSubTitle>
      {browser && (
        <StyledButton icon="external" to="https://polkadot.js.org/extension/">
          Add polkadot plugin
        </StyledButton>
      )}
      <RefreshText variant="h4" onClick={handleChangeStep}>
        Refresh page to use
      </RefreshText>
    </StepWrapper>
  )
}

export default ExtensionStep
