import { FC, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import shallow from 'zustand/shallow'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { RegisterError, useRegister } from '@/hooks/useRegister'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useJoystream } from '@/providers/joystream'

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
  const handleRegister = useRegister()
  const { joystream } = useJoystream()
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
    if (!joystream?.signMessage || !account || !memberId) return
    const userAddress = typeof account === 'object' ? account.address : account
    await handleSubmit((data) => {
      goToStep(ModalSteps.ExtensionSigning)
      handleRegister({
        type: 'extension',
        email: data.email,
        address: userAddress,
        signature: (data) =>
          joystream?.signMessage({
            type: 'payload',
            data,
          }),
        memberId,
      })
        .then(() => setAuthModalOpenName(undefined))
        .catch((error) => {
          goToStep(ModalSteps.Email)
          if (error.message === RegisterError.EmailAlreadyExists) {
            setError('email', { type: 'custom', message: 'Email already exists' })
          }
        })
    })()
  }, [goToStep, handleRegister, handleSubmit, joystream, memberId, setAuthModalOpenName, setError])

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
