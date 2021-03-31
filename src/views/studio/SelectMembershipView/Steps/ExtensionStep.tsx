import React from 'react'
import { installPolkadot } from '../../SignInView/fakeUtils'
import { BrowserIcon, RefreshText, StyledButton } from './ExtensionStep.style'
import { StepSubTitle, StepTitle, StepWrapper } from './Steps.style'

type ExtensionStepProps = {
  browser: 'chrome' | 'firefox' | null
}

const ExtensionStep: React.FC<ExtensionStepProps> = ({ browser }) => {
  const handleRefresh = () => {
    // temporary, normally user will be installing polkadot manually
    installPolkadot()
    window.location.reload()
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
      <RefreshText variant="h4" onClick={handleRefresh}>
        Refresh page to use
      </RefreshText>
    </StepWrapper>
  )
}

export default ExtensionStep
