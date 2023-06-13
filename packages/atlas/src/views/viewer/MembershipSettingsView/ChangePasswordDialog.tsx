import styled from '@emotion/styled'
import { u8aToHex } from '@polkadot/util'
import axios from 'axios'
import { FC, useCallback, useRef, useState } from 'react'

import { PasswordForm } from '@/components/_auth/PasswordForm/PasswordForm'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { keyring } from '@/joystream-lib/lib'
import { decodeSessionEncodedSeedToMnemonic, prepareEncryptionArtifacts } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { media } from '@/styles'
import { SentryLogger } from '@/utils/logs'

type ChangePasswordArgs = {
  joystreamAccountId: string
  gatewayAccountId: string
  email: string
  encodedSeed: string
  newPassword: string
}
export const changePassword = async ({
  email,
  encodedSeed,
  newPassword,
  joystreamAccountId,
  gatewayAccountId,
}: ChangePasswordArgs) => {
  try {
    const mnemonic = await decodeSessionEncodedSeedToMnemonic(encodedSeed)
    if (!mnemonic) {
      throw Error(`Couldn't get mnemonic`)
    }

    const timestamp = Date.now()
    const keypair = keyring.addFromMnemonic(mnemonic)
    const newArtifacts = await prepareEncryptionArtifacts(email, newPassword, mnemonic)

    const changePasswordPayload = {
      joystreamAccountId,
      gatewayName: atlasConfig.general.appName,
      timestamp,
      action: 'changeAccount',
      gatewayAccountId,
      newArtifacts,
    }

    const signatureOverPayload = u8aToHex(keypair.sign(JSON.stringify(changePasswordPayload)))

    return axios.post(
      `${ORION_AUTH_URL}/change-account`,
      {
        signature: signatureOverPayload,
        payload: changePasswordPayload,
      },
      { withCredentials: true }
    )
  } catch (error) {
    SentryLogger.error('Something went wrong during changing password', 'changePassword', error)
  }
}

type ChangePasswordDialogProps = {
  onClose: () => void
  show: boolean
}

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ onClose, show }) => {
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>()
  const { displaySnackbar } = useSnackbar()

  const [isSubmitting, setIsSubmiting] = useState(false)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { currentUser, encodedSeed } = useAuth()

  const handleChangePassword = useCallback(
    async (password: string) => {
      if (!currentUser || !encodedSeed) {
        return
      }
      try {
        setIsSubmiting(true)
        await changePassword({
          email: currentUser.email,
          encodedSeed,
          newPassword: password,
          gatewayAccountId: currentUser.id,
          joystreamAccountId: currentUser.joystreamAccount,
        })
        onClose()
        displaySnackbar({
          iconType: 'success',
          title: 'Password changed successfully',
        })
      } catch (error) {
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong during changing password',
        })
        SentryLogger.error('error', 'ChangePasswordDialog', error)
      } finally {
        setIsSubmiting(false)
      }
    },
    [currentUser, displaySnackbar, encodedSeed, onClose]
  )

  return (
    <StyledDialogModal
      show={show}
      onExitClick={onClose}
      title="Change password"
      contentRef={dialogContentRef}
      primaryButton={{
        ...primaryButtonProps,
        text: isSubmitting ? 'Waiting...' : 'Change password',
        disabled: isSubmitting,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onClose,
      }}
    >
      <PasswordForm
        type="change"
        onPasswordSubmit={handleChangePassword}
        setPrimaryButtonProps={setPrimaryButtonProps}
        dialogContentRef={dialogContentRef}
      />
    </StyledDialogModal>
  )
}

const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`
