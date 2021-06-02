import React, { useEffect, useState } from 'react'
import { StyledButton, StyledStepFooter, StyledListItem } from './ExtensionStep.style'
import { BottomBarIcon, StepSubTitle, StepTitle, StepWrapper, StyledPolkadotLogo } from './SignInSteps.style'
import { Text, Button } from '@/shared/components'
import { useNavigate } from 'react-router'
import { useRouterQuery, useUser } from '@/hooks'
import { SvgGlyphExternal } from '@/shared/icons'

type ExtensionStepProps = {
  nextStepPath: string
}

const ExtensionStep: React.FC<ExtensionStepProps> = ({ nextStepPath }) => {
  const navigate = useNavigate()
  const step = useRouterQuery('step')
  const { extensionConnected, extensionRejected } = useUser()

  const [showDisabledExtensionMessage, setShowDisabledExtensionMessage] = useState(false)

  useEffect(() => {
    if (extensionConnected && step === '1') {
      navigate(nextStepPath)
    }
  }, [extensionConnected, navigate, nextStepPath, step])

  const PolkadotExtensionNotInstalled: React.FC = () => (
    <>
      <StepTitle variant="h4">Add Polkadot extension</StepTitle>
      <StepSubTitle secondary variant="body2">
        To manage your blockchain account, you will need a Polkadot browser extension. Please install it using the
        following link:
      </StepSubTitle>
      <StyledButton icon={<SvgGlyphExternal />} to="https://polkadot.js.org/extension/">
        Install extension
      </StyledButton>
      <Button variant="tertiary" size="small" onClick={() => setShowDisabledExtensionMessage(true)}>
        Polkadot extension already installed? Click here
      </Button>
    </>
  )

  const PolkadotExtensionRejected: React.FC = () => (
    <>
      <StepTitle variant="h4">Enable Polkadot extension website access</StepTitle>
      <StepSubTitle secondary variant="body2">
        It seems like you have disabled Polkadot extension access to the app. Please follow the steps below to enable
        it:
      </StepSubTitle>
      <ol>
        <StyledListItem>Open Polkadot extension menu in the right upper corner of the screen</StyledListItem>
        <StyledListItem>In the menu open settings and Manage Website Access</StyledListItem>
        <StyledListItem>Find play.joystream.org address and switch it to allowed</StyledListItem>
      </ol>
      {showDisabledExtensionMessage && (
        <Button variant="tertiary" size="small" onClick={() => setShowDisabledExtensionMessage(false)}>
          Go back
        </Button>
      )}
    </>
  )

  return (
    <StepWrapper withBottomBar>
      <StyledPolkadotLogo />
      {extensionRejected ? <PolkadotExtensionRejected /> : <PolkadotExtensionNotInstalled />}
      <StyledStepFooter>
        <BottomBarIcon />
        <Text variant="body2" secondary>
          Please reload the page and allow access after installing the extension
        </Text>
      </StyledStepFooter>
    </StepWrapper>
  )
}

export default ExtensionStep
