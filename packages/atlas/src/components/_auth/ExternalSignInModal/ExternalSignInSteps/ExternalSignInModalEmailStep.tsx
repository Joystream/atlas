import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useRegister } from '@/hooks/useRegister'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useJoystream } from '@/providers/joystream'

import { ExternalSignInModalStepTemplate } from './ExternalSignInModalStepTemplate'
import { ModalSteps, SignInStepProps } from './ExternalSignInSteps.types'

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
  const { setAuthModalOpen } = useAuthStore(
    (state) => ({ authModalOpen: state.authModalOpen, setAuthModalOpen: state.actions.setAuthModalOpen }),
    shallow
  )
  const { register, formState, handleSubmit } = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      })
    ),
  })

  const handleConfirm = useCallback(async () => {
    const address = await joystream?.selectedAccountId
    if (!joystream?.signMessage || !address || !memberId) return
    goToStep(ModalSteps.Logging)
    await handleSubmit((data) => {
      handleRegister({
        type: 'extension',
        email: data.email,
        address,
        signature: (data) =>
          joystream?.signMessage({
            type: 'payload',
            data,
          }),
        memberId,
      })
        .then(() => setAuthModalOpen(undefined))
        .catch(() => goToStep(ModalSteps.Email))
    })()
  }, [goToStep, handleRegister, handleSubmit, joystream, memberId, setAuthModalOpen])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: handleConfirm,
    })
  }, [handleConfirm, setPrimaryButtonProps])

  return (
    <ExternalSignInModalStepTemplate
      title="Add your email"
      subtitle="Get notified about important events and stay updated. You can change all notifications permissions in your profile settings."
      hasNavigatedBack={false}
    >
      <FormField label="Email" error={formState.errors.email?.message}>
        <Input {...register('email')} placeholder="Email" />
      </FormField>
    </ExternalSignInModalStepTemplate>
  )
}
