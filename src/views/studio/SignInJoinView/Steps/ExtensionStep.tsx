import React from 'react'
import { StyledButton } from './ExtensionStep.style'
import { BottomBarContainer, BottomBarIcon, StepSubTitle, StepTitle, StepWrapper } from './Steps.style'
import polkadotIcon from '@/assets/polkadot.png'
import { Text } from '@/shared/components'

const ExtensionStep: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload()
  }
  return (
    <StepWrapper centered withBottomBar>
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
