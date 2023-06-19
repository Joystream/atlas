import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { changePassword, entropyToMnemonic, getArtifactId, getArtifacts } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { LogInErrors } from '@/providers/auth/auth.types'
import { useSnackbar } from '@/providers/snackbars'
import { cVar, media, sizes } from '@/styles'
import { passwordAndRepeatPasswordSchema } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'

type ChangePasswordDialogProps = {
  onClose: () => void
  show: boolean
}

type PasswordStepForm = {
  password: string
  confirmPassword: string
}

export const getMnemonicFromeEmailAndPassword = async (email: string, password: string) => {
  const id = await getArtifactId(email, password)
  const data = await getArtifacts(id, email, password)
  if (!data?.decryptedEntropy) {
    throw Error("Couldn't fetch artifacts")
  }
  const mnemonic = entropyToMnemonic(data?.decryptedEntropy)
  return mnemonic
}

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ onClose, show }) => {
  const { displaySnackbar } = useSnackbar()
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [isSubmitting, setIsSubmiting] = useState(false)
  const { currentUser } = useAuth()

  const verifyPasswordForm = useForm<{ oldPassword: string }>({
    shouldFocusError: true,
  })

  const handleVerifyPassword = useCallback(() => {
    verifyPasswordForm.handleSubmit(async (data) => {
      if (!currentUser) {
        throw Error('Current user is not set')
      }
      try {
        setIsSubmiting(true)
        const mnemonic = await getMnemonicFromeEmailAndPassword(currentUser.email, data.oldPassword)
        setMnemonic(mnemonic)
      } catch (error) {
        if (error.message === LogInErrors.ArtifactsNotFound) {
          // assume this is incorrect password error
          verifyPasswordForm.setError('oldPassword', { message: 'Incorrect password.' })
          return
        }
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong during verifying your password',
        })
        SentryLogger.error('error', 'ChangePasswordDialog', error)
      } finally {
        setIsSubmiting(false)
      }
    })()
  }, [currentUser, displaySnackbar, verifyPasswordForm])

  const changePasswordform = useForm<PasswordStepForm>({
    shouldFocusError: true,
    resolver: zodResolver(passwordAndRepeatPasswordSchema),
  })

  const [hideOldPasswordProps, resethideOldPassword] = useHidePasswordInInput()
  const [hidePasswordProps, resethidePassword] = useHidePasswordInInput()
  const [hideConfirmPasswordProps, resethideConfirmPassword] = useHidePasswordInInput()

  const handleClose = useCallback(() => {
    verifyPasswordForm.reset({ oldPassword: '' })
    changePasswordform.reset({ password: '', confirmPassword: '' })
    resethideOldPassword()
    resethidePassword()
    resethideConfirmPassword()
    setMnemonic(null)
    onClose()
  }, [
    changePasswordform,
    onClose,
    resethideConfirmPassword,
    resethideOldPassword,
    resethidePassword,
    verifyPasswordForm,
  ])

  const handleChangePassword = useCallback(() => {
    changePasswordform.handleSubmit(async (data) => {
      if (!currentUser || !mnemonic) {
        throw Error('Current user is not set or mnemonic is null')
      }
      try {
        setIsSubmiting(true)
        await changePassword({
          email: currentUser.email,
          mnemonic,
          newPassword: data.password,
          gatewayAccountId: currentUser.id,
          joystreamAccountId: currentUser.joystreamAccount,
        })
        handleClose()
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
  }, [changePasswordform, currentUser, displaySnackbar, handleClose, mnemonic])

  return (
    <>
      <StyledDialogModal
        show={show}
        onExitClick={handleClose}
        title="Change password"
        primaryButton={
          mnemonic
            ? {
                text: isSubmitting ? 'Waiting...' : 'Change password',
                disabled: isSubmitting,
                onClick: handleChangePassword,
              }
            : {
                text: 'Continue',
                disabled: isSubmitting,
                onClick: handleVerifyPassword,
              }
        }
        secondaryButton={{
          text: 'Cancel',
          onClick: handleClose,
        }}
      >
        {!mnemonic ? (
          <FormField
            label="Password"
            description="Enter your current password to change it."
            error={verifyPasswordForm.formState.errors.oldPassword?.message}
          >
            <Input
              placeholder="Password"
              {...verifyPasswordForm.register('oldPassword', {
                validate: {
                  required: (value) => (value ? true : 'Enter password.'),
                },
              })}
              {...hideOldPasswordProps}
              autoComplete="off"
            />
          </FormField>
        ) : (
          <Wrapper>
            <FormField label="New password" error={changePasswordform.formState.errors.password?.message}>
              <Input
                placeholder="New password"
                {...changePasswordform.register('password')}
                {...hidePasswordProps}
                autoComplete="new-password"
              />
            </FormField>
            <FormField label="Repeat Password" error={changePasswordform.formState.errors.confirmPassword?.message}>
              <Input
                placeholder="Repeat password"
                {...changePasswordform.register('confirmPassword')}
                {...hideConfirmPasswordProps}
                autoComplete="new-password"
              />
            </FormField>
            <FormProvider {...changePasswordform}>
              <PasswordCriterias />
            </FormProvider>
          </Wrapper>
        )}
      </StyledDialogModal>
    </>
  )
}

const forwardAnimation = keyframes`
  from {
    transform: translateX(-32px);
    opacity: 0;
  }
`
const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`

const Wrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
  animation: ${forwardAnimation} ${cVar('animationTransitionMedium')};
`
