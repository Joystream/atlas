import { useFormContext } from 'react-hook-form'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import {
  ForgotPasswordModalForm,
  ForgotPasswordStep,
} from '@/components/_auth/ForgotPasswordModal/ForgotPasswordModal.types'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'

import { PasswordCriterias } from '../../PasswordCriterias'
import { GapContainer } from '../ForgotPasswordModal.styles'

export const NewPasswordStep = () => {
  const { register, formState } = useFormContext<ForgotPasswordModalForm>()
  const [hidePasswordProps] = useHidePasswordInInput()
  const [hideConfirmPasswordProps] = useHidePasswordInInput()

  return (
    <AuthenticationModalStepTemplate hasNavigatedBack={false} title="Change password" subtitle="Set your new password.">
      <GapContainer>
        <FormField label="New password" error={formState.errors.NewPasswordStep?.password?.message}>
          <Input
            data-ls-disabled
            placeholder="Password"
            {...register(`${ForgotPasswordStep.NewPasswordStep}.password`)}
            {...hidePasswordProps}
          />
        </FormField>
        <FormField label="Repeat password" error={formState.errors.NewPasswordStep?.confirmPassword?.message}>
          <Input
            data-ls-disabled
            placeholder="Confirm password"
            {...register(`${ForgotPasswordStep.NewPasswordStep}.confirmPassword`)}
            {...hideConfirmPasswordProps}
          />
        </FormField>
        <PasswordCriterias path={`${ForgotPasswordStep.NewPasswordStep}.password`} />
      </GapContainer>
    </AuthenticationModalStepTemplate>
  )
}
