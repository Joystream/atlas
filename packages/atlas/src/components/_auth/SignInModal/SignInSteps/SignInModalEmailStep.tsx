import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { SignInStepProps } from './SignInSteps.types'

type SignInModalEmailStepProps = SignInStepProps & {
  onConfirm?: (address: string) => void
}

export const SignInModalEmailStep: FC<SignInModalEmailStepProps> = ({ setPrimaryButtonProps, onConfirm }) => {
  const { register, formState, handleSubmit } = useForm<{ email: string }>({
    resolver: (data, ctx, options) => {
      return zodResolver(
        z.object({
          email: z.string().email(),
        })
      )(data, ctx, options)
    },
  })

  const handleConfirm = useCallback(() => {
    handleSubmit((data) => {
      console.log(data)
    })()
  }, [handleSubmit])

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
