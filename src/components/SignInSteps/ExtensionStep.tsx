import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Text } from '@/components/Text'
import { SvgGlyphExternal } from '@/components/_icons'
import { Button } from '@/components/_inputs/Button'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user'

import {
  PolkadotExtensionRejectedWrapper,
  StyledButton,
  StyledListItem,
  StyledStepFooter,
} from './ExtensionStep.styles'
import { BottomBarIcon, StepSubTitle, StepTitle, StepWrapper, StyledPolkadotLogo } from './SignInSteps.styles'

type ExtensionStepProps = {
  nextStepPath: string
}

export const ExtensionStep: React.FC<ExtensionStepProps> = ({ nextStepPath }) => {
  const navigate = useNavigate()
  const step = useRouterQuery('step')
  const { extensionConnected } = useUser()
  const [openEnableExtensionDialog, closeEnableExtensionDialog] = useConfirmationModal({
    children: <PolkadotExtensionRejected />,
    onExitClick: () => closeEnableExtensionDialog(),
  })

  useEffect(() => {
    if (extensionConnected && step === '1') {
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
    <StepTitle variant="h4">Allow Polkadot extension access</StepTitle>
    <StepSubTitle secondary variant="body2">
      If you’ve denied Polkadot extension access for this website, you won’t be able to use Joystream studio. To allow
      access, you can take the following steps:
    </StepSubTitle>
    <ol>
      <StyledListItem secondary as="li" variant="caption">
        Open the extension popup with the icon in your browser bar
      </StyledListItem>
      <StyledListItem secondary as="li" variant="caption">
        Use cog icon in upper right corner to open settings and select {'"Manage Website Access"'}
      </StyledListItem>
      <StyledListItem secondary as="li" variant="caption">
        Find play.joystream.org address and switch it to allowed
      </StyledListItem>
      <StyledListItem secondary as="li" variant="caption">
        Reload the page
      </StyledListItem>
    </ol>
  </PolkadotExtensionRejectedWrapper>
)
