import { FC } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  LogosWrapper,
  StyledAppLogo,
  StyledSvgControlsConnect,
  StyledSvgLogoYoutube,
} from './ConnectWithYtModal.styles'

import { DialogModal } from '../DialogModal'

export type ConnectWithYtModalProps = {
  show: boolean
  onClose: () => void
  onSignUp: () => void
}

export const ConnectWithYtModal: FC<ConnectWithYtModalProps> = ({ show, onClose, onSignUp }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <DialogModal
      show={show}
      dividers
      secondaryButton={{
        text: 'Close',
        onClick: onClose,
      }}
      primaryButton={{
        text: 'Sign up now',
        onClick: onSignUp,
      }}
      additionalActionsNode={
        <Button to={absoluteRoutes.studio.yppDashboard()} size="medium" variant="tertiary">
          Learn more
        </Button>
      }
    >
      <LogosWrapper>
        <StyledSvgLogoYoutube />
        <StyledSvgControlsConnect />
        <StyledAppLogo height={36} width={undefined} />
      </LogosWrapper>
      <Text variant={smMatch ? 'h500' : 'h400'} as="h2" margin={{ bottom: 2 }}>
        Connect with YouTube?
      </Text>
      <Text variant="t200" as="p" color="colorText">
        Reupload and backup your YouTube videos to receive to receive a guaranteed payout in the YouTube Partner
        Program.
      </Text>
    </DialogModal>
  )
}
