import React from 'react'
import { installPolkadot } from '../../fakeUtils'
import { StyledButton } from './ExtensionStep.style'
import { BottomBarContainer, BottomBarIcon, StepSubTitle, StepTitle, StepWrapper } from './Steps.style'
import polkadotIcon from '@/assets/polkadot.png'
import { Text } from '@/shared/components'

type ExtensionStepProps = {
  browser: 'chrome' | 'firefox' | null
}

const ExtensionStep: React.FC<ExtensionStepProps> = () => {
  const handleRefresh = () => {
    // temporary, normally user will be installing polkadot manually
    installPolkadot()
    window.location.reload()
  }
  return (
    <StepWrapper centered>
      <img src={polkadotIcon} alt="polkadot icon" />
      <StepTitle variant="h4">Add polkadot extension</StepTitle>
      <StepSubTitle secondary variant="body2">
        Please enable Polkadot extension or install it using following plugin link.
      </StepSubTitle>
      <StyledButton icon="external" to="https://polkadot.js.org/extension/">
        Install extension
      </StyledButton>
      <BottomBarContainer onClick={handleRefresh}>
        <BottomBarIcon name="dialog-warning" />
        <Text variant="body2" secondary>
          Prease reload the page after installing the plugin
        </Text>
      </BottomBarContainer>
    </StepWrapper>
  )
}

export default ExtensionStep
