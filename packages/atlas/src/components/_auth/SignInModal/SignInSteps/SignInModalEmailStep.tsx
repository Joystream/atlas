import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useRegister } from '@/hooks/useRegister'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useUserStore } from '@/providers/user/user.store'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { ModalSteps, SignInStepProps } from './SignInSteps.types'

type SignInModalEmailStepProps = SignInStepProps & {
  onConfirm?: (address: string) => void
}

export const SignInModalEmailStep: FC<SignInModalEmailStepProps> = ({ setPrimaryButtonProps, goToStep }) => {
  const handleRegister = useRegister()
  const { joystream } = useJoystream()
  const { setSignInModalOpen } = useUserStore(
    (state) => ({ signInModalOpen: state.signInModalOpen, setSignInModalOpen: state.actions.setSignInModalOpen }),
    shallow
  )
  const { register, formState, handleSubmit } = useForm<{ email: string }>({
    resolver: (data, ctx, options) => {
      return zodResolver(
        z.object({
          email: z.string().email(),
        })
      )(data, ctx, options)
    },
  })

  const handleConfirm = useCallback(async () => {
    const address = await joystream?.selectedAccountId
    if (!joystream?.signMessage || !address) return
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
      })
        .then(() => setSignInModalOpen(false))
        .catch(() => goToStep(ModalSteps.Email))
    })()
  }, [goToStep, handleRegister, handleSubmit, joystream, setSignInModalOpen])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: handleConfirm,
    })
  }, [handleConfirm, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Add your email"
      subtitle="Get notified about important events and stay updated. You can change all notifications permissions in your profile settings."
      hasNavigatedBack={false}
    >
      <FormField label="Email" error={formState.errors.email?.message}>
        <Input {...register('email')} placeholder="Email" />
      </FormField>
    </SignInModalStepTemplate>
  )
}
