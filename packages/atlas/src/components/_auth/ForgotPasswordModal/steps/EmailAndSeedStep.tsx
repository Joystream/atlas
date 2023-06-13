import { useFormContext } from 'react-hook-form'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import {
  ForgotPasswordModalForm,
  ForgotPasswordStep,
} from '@/components/_auth/ForgotPasswordModal/ForgotPasswordModal.types'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'

import { GapContainer } from '../ForgotPasswordModal.styles'

export const EmailAndSeedStep = () => {
  const { register, formState } = useFormContext<ForgotPasswordModalForm>()
  return (
    <AuthenticationModalStepTemplate
      hasNavigatedBack={false}
      title="Change password"
      subtitle="To change your password first we have to verify your ownership of this membership."
    >
      <GapContainer>
        <FormField
          label="Wallet seed"
          description="Its the seed that you were asked to save when creating your membership."
          error={formState.errors.EmailAndSeedStep?.seed?.message}
        >
          <TextArea rows={2} placeholder="Wallet seed" {...register(`${ForgotPasswordStep.EmailAndSeedStep}.seed`)} />
        </FormField>
        <FormField
          label="Email"
          description="Email that you used to create your membership."
          error={formState.errors.EmailAndSeedStep?.email?.message}
        >
          <Input {...register(`${ForgotPasswordStep.EmailAndSeedStep}.email`)} placeholder="Email" />
        </FormField>
      </GapContainer>
    </AuthenticationModalStepTemplate>
  )
}
