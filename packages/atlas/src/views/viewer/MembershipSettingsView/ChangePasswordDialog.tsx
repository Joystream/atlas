import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { u8aToHex } from '@polkadot/util'
import axios from 'axios'
import { FC, useCallback, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { keyring } from '@/joystream-lib/lib'
import { decodeSessionEncodedSeedToMnemonic, prepareEncryptionArtifacts } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { media, sizes } from '@/styles'
import { passwordAndRepeatPasswordSchema } from '@/utils/formValidationOptions'
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

type PasswordStepForm = {
  password: string
  confirmPassword: string
}

type PasswordInputNames = keyof PasswordStepForm

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ onClose, show }) => {
  const { displaySnackbar } = useSnackbar()

  const form = useForm<PasswordStepForm>({
    shouldFocusError: true,
    resolver: zodResolver(passwordAndRepeatPasswordSchema),
  })

  const [isFieldVisible, setIsFieldVisible] = useState<Record<PasswordInputNames, boolean>>({
    password: false,
    confirmPassword: false,
  })

  const [isSubmitting, setIsSubmiting] = useState(false)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { currentUser, encodedSeed } = useAuth()

  const handleChangePassword = useCallback(() => {
    form.handleSubmit(async (data) => {
      if (!currentUser || !encodedSeed) {
        return
      }
      try {
        setIsSubmiting(true)
        await changePassword({
          email: currentUser.email,
          encodedSeed,
          newPassword: data.password,
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
    })()
  }, [currentUser, displaySnackbar, encodedSeed, form, onClose])

  const hasDoneInitialScroll = useRef(false)

  const handleTogglePassword = (name: PasswordInputNames) => {
    setIsFieldVisible((fields) => ({ ...fields, [name]: !fields[name] }))
  }
  const getInputProps = useCallback(
    (name: PasswordInputNames): InputProps => {
      return {
        ...form.register(name),
        type: isFieldVisible[name] ? 'text' : 'password',
        actionButton: {
          children: isFieldVisible[name] ? 'Hide' : 'Show',
          dontFocusOnClick: true,
          icon: isFieldVisible[name] ? <SvgActionHide /> : <SvgActionShow />,
          onClick: () => handleTogglePassword(name),
        },
      }
    },
    [form, isFieldVisible]
  )

  return (
    <StyledDialogModal
      show={show}
      onExitClick={onClose}
      title="Change password"
      contentRef={dialogContentRef}
      primaryButton={{
        text: isSubmitting ? 'Waiting...' : 'Change password',
        disabled: isSubmitting,
        onClick: handleChangePassword,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onClose,
      }}
    >
      <Wrapper>
        <FormField label="New password" error={form.formState.errors.password?.message}>
          <Input
            placeholder="New password"
            {...getInputProps('password')}
            autoComplete="off"
            onClick={() => {
              if (hasDoneInitialScroll.current || !dialogContentRef?.current) return
              hasDoneInitialScroll.current = true
              dialogContentRef.current.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: 'smooth' })
            }}
          />
        </FormField>
        <FormField label="Repeat Password" error={form.formState.errors.confirmPassword?.message}>
          <Input placeholder="Repeat password" {...getInputProps('confirmPassword')} autoComplete="off" />
        </FormField>
        <FormProvider {...form}>
          <PasswordCriterias />
        </FormProvider>
      </Wrapper>
    </StyledDialogModal>
  )
}

const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`

const Wrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
`
