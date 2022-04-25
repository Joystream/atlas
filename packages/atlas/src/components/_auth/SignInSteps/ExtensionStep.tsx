import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionNewTab } from '@/components/_icons'
import { QUERY_PARAMS } from '@/config/routes'
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
  const step = useRouterQuery(QUERY_PARAMS.LOGIN)
  const { extensionConnected } = useUser()
  const [openEnableExtensionDialog, closeEnableExtensionDialog] = useConfirmationModal({
    children: <PolkadotExtensionRejected />,
    onExitClick: () => closeEnableExtensionDialog(),
  })
  useEffect(() => {
    if (extensionConnected && step === '1') {
      navigate({ search: nextStepPath })
    }
  }, [extensionConnected, navigate, nextStepPath, step])

  return (
    <>
      <StepWrapper>
        <StyledPolkadotLogo />
        <StepTitle variant="h500">Add Polkadot extension</StepTitle>
        <StepSubTitle secondary variant="t200">
          To manage your blockchain account, you will need a Polkadot browser extension. Please install it using the
          following link:
        </StepSubTitle>
        <StyledButton icon={<SvgActionNewTab />} to="https://polkadot.js.org/extension/">
          Install extension
        </StyledButton>
        <Button variant="tertiary" size="small" onClick={() => openEnableExtensionDialog()}>
          Polkadot extension already installed? Click here
        </Button>
      </StepWrapper>
      <StyledStepFooter>
        <BottomBarIcon />
        <Text variant="t200" secondary>
          Please reload the page and allow access after installing the extension
        </Text>
      </StyledStepFooter>
    </>
  )
}

export const PolkadotExtensionRejected: React.FC = () => (
  <PolkadotExtensionRejectedWrapper>
    <StyledPolkadotLogo />
    <StepTitle variant="h500">Allow Polkadot extension access</StepTitle>
    <StepSubTitle secondary variant="t200">
      If you’ve denied Polkadot extension access for this website, you won’t be able to use Joystream studio. To allow
      access, you can take the following steps:
    </StepSubTitle>
    <ol>
      <StyledListItem secondary as="li" variant="t100">
        Open the extension popup with the icon in your browser bar
      </StyledListItem>
      <StyledListItem secondary as="li" variant="t100">
        Use cog icon in upper right corner to open settings and select "Manage Website Access"
      </StyledListItem>
      <StyledListItem secondary as="li" variant="t100">
        Find play.joystream.org address and switch it to allowed
      </StyledListItem>
      <StyledListItem secondary as="li" variant="t100">
        Reload the page
      </StyledListItem>
    </ol>
  </PolkadotExtensionRejectedWrapper>
)
