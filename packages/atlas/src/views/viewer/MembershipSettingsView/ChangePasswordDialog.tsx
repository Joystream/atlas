import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { changePassword } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { media, sizes } from '@/styles'
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

  const form = useForm<PasswordStepForm>({
    shouldFocusError: true,
    resolver: zodResolver(passwordAndRepeatPasswordSchema),
  })
  const hidePasswordProps = useHidePasswordInInput()
  const hideConfirmPasswordProps = useHidePasswordInInput()

  const handleClose = () => {
    form.reset({ password: '', confirmPassword: '' })
    onClose()
  }

  const [isSubmitting, setIsSubmiting] = useState(false)
  const { currentUser, encodedSeed } = useAuth()

  const handleChangePassword = useCallback(() => {
    form.handleSubmit(async (data) => {
      if (!currentUser || !encodedSeed) {
        throw Error('Current user or enodedSeed is not set')
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

  return (
    <StyledDialogModal
      show={show}
      onExitClick={handleClose}
      title="Change password"
      primaryButton={{
        text: isSubmitting ? 'Waiting...' : 'Change password',
        disabled: isSubmitting,
        onClick: handleChangePassword,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: handleClose,
      }}
    >
      <Wrapper>
        <FormField label="New password" error={form.formState.errors.password?.message}>
          <Input placeholder="New password" {...form.register('password')} {...hidePasswordProps} autoComplete="off" />
        </FormField>
        <FormField label="Repeat Password" error={form.formState.errors.confirmPassword?.message}>
          <Input
            placeholder="Repeat password"
            {...form.register('confirmPassword')}
            {...hideConfirmPasswordProps}
            autoComplete="off"
          />
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
