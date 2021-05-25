import React, { useEffect } from 'react'
import { StyledButton } from './ExtensionStep.style'
import { StepFooter, BottomBarIcon, StepSubTitle, StepTitle, StepWrapper, StyledLogo } from './SignInSteps.style'
import polkadotIcon from '@/assets/polkadot-logo.svg'
import { Text } from '@/shared/components'
import { useNavigate } from 'react-router'
import { useRouterQuery, useUser } from '@/hooks'
import { SvgGlyphExternal } from '@/shared/icons'

type ExtensionStepProps = {
  nextStepPath: string
}

const ExtensionStep: React.FC<ExtensionStepProps> = ({ nextStepPath }) => {
  const navigate = useNavigate()
  const step = useRouterQuery('step')
  const { extensionConnected } = useUser()

  useEffect(() => {
    if (extensionConnected && step === '1') {
      navigate(nextStepPath)
    }
  }, [extensionConnected, navigate, nextStepPath, step])

  return (
    <StepWrapper withBottomBar>
      <StyledLogo src={polkadotIcon} alt="polkadot icon" />
      <StepTitle variant="h4">Add Polkadot extension</StepTitle>
      <StepSubTitle secondary variant="body2">
        To manage your blockchain account, you will need a Polkadot browser extension. Please install it using the
        following link:
      </StepSubTitle>
      <StyledButton icon={<SvgGlyphExternal />} to="https://polkadot.js.org/extension/">
        Install extension
      </StyledButton>
      <StepFooter>
        <BottomBarIcon />
        <Text variant="body2" secondary>
          Please reload the page and allow access after installing the extension
        </Text>
      </StepFooter>
    </StepWrapper>
  )
}

export default ExtensionStep
