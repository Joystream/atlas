import { FC } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  LogosWrapper,
  StyledAppLogo,
  StyledSvgControlsConnect,
  StyledSvgLogoYoutube,
} from './ConnectWithYtModal.styles'

import { DialogModal } from '../DialogModal'

export type ConnectWithYtModalProps = {
  entityId: string
  show: boolean
  onClose: () => void
  onSignUp: () => void
}

export const ConnectWithYtModal: FC<ConnectWithYtModalProps> = ({ show, onClose }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <DialogModal
      show={show}
      dividers
      secondaryButton={{
        text: 'Cancel',
        onClick: onClose,
      }}
      primaryButton={{
        text: 'Sign up now',
      }}
      additionalActionsNode={
        <Button size="medium" variant="tertiary">
          Learn more
        </Button>
      }
    >
      <LogosWrapper>
        <StyledSvgLogoYoutube />
        <StyledSvgControlsConnect />
        {/* todo use AppLogo component here */}
        <StyledAppLogo height={36} width={undefined} />
      </LogosWrapper>
      <Text variant={smMatch ? 'h500' : 'h400'} as="h2" margin={{ bottom: 2 }}>
        Connect with youtube?
      </Text>
      <Text variant="t200" as="p" color="colorText">
        Reupload and backup your YouTube videos to receive to receive a guaranteed payout in the YouTube Partner
        Program.
      </Text>
    </DialogModal>
  )
}
