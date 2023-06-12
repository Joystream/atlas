import { FC, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import shallow from 'zustand/shallow'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { registerAccount } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { OrionAccountError } from '@/providers/auth/auth.types'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'

import { ModalSteps, SignInStepProps } from './ExternalSignInSteps.types'

import { AuthenticationModalStepTemplate } from '../../AuthenticationModalStepTemplate'

type SignInModalEmailStepProps = SignInStepProps & {
  onConfirm?: (address: string) => void
  memberId: string | null
}

export const ExternalSignInModalEmailStep: FC<SignInModalEmailStepProps> = ({
  setPrimaryButtonProps,
  goToStep,
  memberId,
}) => {
  const { handleLogin } = useAuth()
  const { joystream } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const { handleSubmit, setError, formState, register } = useFormContext<{ email: string }>()
  const handleConfirm = useCallback(async () => {
    const account = await joystream?.selectedAccountId
    if (!joystream?.signMessage || !account || !memberId || !formState.isValid) return
    const userAddress = typeof account === 'object' ? account.address : account
    await handleSubmit(async (data) => {
      goToStep(ModalSteps.ExtensionSigning)

      try {
        const address = await registerAccount({
          type: 'external',
          email: data.email,
          address: userAddress,
          signature: (data) =>
            joystream?.signMessage({
              type: 'payload',
              data,
            }),
          memberId,
        })

        if (address) {
          await handleLogin({
            type: 'external',
            address,
            sign: (data) =>
              joystream?.signMessage({
                type: 'payload',
                data,
              }),
          })
        }
        setAuthModalOpenName(undefined)
      } catch (error) {
        if (error instanceof OrionAccountError) {
          if (error.message === 'Account with the provided e-mail address already exists.') {
            displaySnackbar({
              title: 'Something went wrong',
              description: `Account with the provided e-mail address already exists. Use different e-mail.`,
              iconType: 'error',
            })
            goToStep(ModalSteps.Email)
            setError('email', { type: 'custom', message: 'Email already exists' })
          }
        }
      }
    })()
  }, [
    displaySnackbar,
    formState.isValid,
    goToStep,
    handleLogin,
    handleSubmit,
    joystream,
    memberId,
    setAuthModalOpenName,
    setError,
  ])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: handleConfirm,
    })
  }, [handleConfirm, setPrimaryButtonProps])

  return (
    <AuthenticationModalStepTemplate
      title="Add your email"
      subtitle="Get notified about important events and stay updated. You can change all notifications permissions in your profile settings."
      hasNavigatedBack={false}
    >
      <FormField label="Email" error={formState.errors.email?.message}>
        <Input {...register('email')} placeholder="Email" />
      </FormField>
    </AuthenticationModalStepTemplate>
  )
}
