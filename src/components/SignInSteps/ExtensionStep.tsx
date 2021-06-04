import React, { useEffect } from 'react'
import { StyledButton, StyledStepFooter, StyledListItem, PolkadotExtensionRejectedWrapper } from './ExtensionStep.style'
import { BottomBarIcon, StepSubTitle, StepTitle, StepWrapper, StyledPolkadotLogo } from './SignInSteps.style'
import { Text, Button } from '@/shared/components'
import { useNavigate } from 'react-router'
import { useRouterQuery, useUser, useDialog } from '@/hooks'
import { SvgGlyphExternal } from '@/shared/icons'

type ExtensionStepProps = {
  nextStepPath?: string
}

const ExtensionStep: React.FC<ExtensionStepProps> = ({ nextStepPath }) => {
  const navigate = useNavigate()
  const step = useRouterQuery('step')
  const { extensionConnected } = useUser()
  const [openEnableExtensionDialog, closeEnableExtensionDialog] = useDialog({
    additionalActionsNode: <PolkadotExtensionRejected />,
    onExitClick: () => closeEnableExtensionDialog(),
  })

  useEffect(() => {
    if (extensionConnected && nextStepPath && step === '1') {
      navigate(nextStepPath)
    }
  }, [extensionConnected, navigate, nextStepPath, step])

  return (
    <StepWrapper>
      <StyledPolkadotLogo />
      <StepTitle variant="h4">Add Polkadot extension</StepTitle>
      <StepSubTitle secondary variant="body2">
        To manage your blockchain account, you will need a Polkadot browser extension. Please install it using the
        following link:
      </StepSubTitle>
      <StyledButton icon={<SvgGlyphExternal />} to="https://polkadot.js.org/extension/">
        Install extension
      </StyledButton>
      <Button variant="tertiary" size="small" onClick={() => openEnableExtensionDialog()}>
        Polkadot extension already installed? Click here
      </Button>
      <StyledStepFooter>
        <BottomBarIcon />
        <Text variant="body2" secondary>
          Please reload the page and allow access after installing the extension
        </Text>
      </StyledStepFooter>
    </StepWrapper>
  )
}

export const PolkadotExtensionRejected: React.FC = () => (
  <PolkadotExtensionRejectedWrapper>
    <StyledPolkadotLogo />
    <StepTitle variant="h4">Enable Polkadot extension website access</StepTitle>
    <StepSubTitle secondary variant="body2">
      It seems like you have disabled Polkadot extension access to the app. Please follow the steps below to enable it:
    </StepSubTitle>
    <ol>
      <StyledListItem secondary as="li" variant="caption">
        Open Polkadot extension menu in the right upper corner of the screen
      </StyledListItem>
      <StyledListItem secondary as="li" variant="caption">
        In the menu open settings and Manage Website Access
      </StyledListItem>
      <StyledListItem secondary as="li" variant="caption">
        Find play.joystream.org address and switch it to allowed
      </StyledListItem>
      <StyledListItem secondary as="li" variant="caption">
        Reload the page after enabling the extension
      </StyledListItem>
    </ol>
  </PolkadotExtensionRejectedWrapper>
)

export default ExtensionStep
