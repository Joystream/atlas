import React, { useEffect } from 'react'
import { StyledButton } from './ExtensionStep.style'
import { StepFooter, BottomBarIcon, StepSubTitle, StepTitle, StepWrapper } from './Steps.style'
import polkadotIcon from '@/assets/polkadot.png'
import { Text } from '@/shared/components'
import { useNavigate } from 'react-router'
import { useJoystream } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
import { SvgGlyphExternal } from '@/shared/icons'

const ExtensionStep: React.FC = () => {
  const navigate = useNavigate()
  const { extensionConnected } = useJoystream()

  useEffect(() => {
    if (extensionConnected) {
      navigate(absoluteRoutes.studio.join({ step: '1' }))
    }
  }, [extensionConnected, navigate])

  return (
    <StepWrapper centered withBottomBar>
      <img src={polkadotIcon} alt="polkadot icon" />
      <StepTitle variant="h4">Add polkadot extension</StepTitle>
      <StepSubTitle secondary variant="body2">
        Please enable Polkadot extension or install it using following plugin link.
      </StepSubTitle>
      <StyledButton icon={<SvgGlyphExternal />} to="https://polkadot.js.org/extension/">
        Install extension
      </StyledButton>
      <StepFooter>
        <BottomBarIcon />
        <Text variant="body2" secondary>
          Please reload the page after installing the plugin
        </Text>
      </StepFooter>
    </StepWrapper>
  )
}

export default ExtensionStep
