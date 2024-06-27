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
import { changePassword, getMnemonicFromeEmailAndPassword } from '@/providers/auth/auth.helpers'
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

  const changePasswordForm = useForm<PasswordStepForm>({
    shouldFocusError: true,
    resolver: zodResolver(passwordAndRepeatPasswordSchema(true)),
  })

  const [hideOldPasswordProps, resetHideOldPassword] = useHidePasswordInInput()
  const [hidePasswordProps, resetHidePassword] = useHidePasswordInInput()
  const [hideConfirmPasswordProps, resetHideConfirmPassword] = useHidePasswordInInput()

  const handleClose = useCallback(() => {
    verifyPasswordForm.reset({ oldPassword: '' })
    changePasswordForm.reset({ password: '', confirmPassword: '' })
    resetHideOldPassword()
    resetHidePassword()
    resetHideConfirmPassword()
    setMnemonic(null)
    onClose()
  }, [
    changePasswordForm,
    onClose,
    resetHideConfirmPassword,
    resetHideOldPassword,
    resetHidePassword,
    verifyPasswordForm,
  ])

  const handleChangePassword = useCallback(() => {
    changePasswordForm.handleSubmit(async (data) => {
      if (!currentUser || !mnemonic || !currentUser.joystreamAccountId) {
        throw Error('Current user is not set or mnemonic is null')
      }
      try {
        setIsSubmiting(true)
        await changePassword({
          email: currentUser.email,
          mnemonic,
          newPassword: data.password,
          gatewayAccountId: currentUser.id,
          joystreamAccountId: currentUser.joystreamAccountId,
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
  }, [changePasswordForm, currentUser, displaySnackbar, handleClose, mnemonic])

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
              data-ls-disabled
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
            <FormField label="New password" error={changePasswordForm.formState.errors.password?.message}>
              <Input
                data-ls-disabled
                placeholder="New password"
                {...changePasswordForm.register('password')}
                {...hidePasswordProps}
                autoComplete="new-password"
              />
            </FormField>
            <FormField label="Repeat Password" error={changePasswordForm.formState.errors.confirmPassword?.message}>
              <Input
                data-ls-disabled
                placeholder="Repeat password"
                {...changePasswordForm.register('confirmPassword')}
                {...hideConfirmPasswordProps}
                autoComplete="new-password"
              />
            </FormField>
            <FormProvider {...changePasswordForm}>
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
