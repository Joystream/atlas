import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import {
  ForgotPasswordModalForm,
  ForgotPasswordStep,
} from '@/components/_auth/ForgotPasswordModal/ForgotPasswordModal.types'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'

import { PasswordCriterias } from '../../PasswordCriterias'
import { GapContainer } from '../ForgotPasswordModal.styles'

export const NewPasswordStep = () => {
  const { register, formState } = useFormContext<ForgotPasswordModalForm>()
  const [isFieldVisible, setIsFieldVisible] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false,
  })

  const getInputProps = useCallback(
    (name: string): Partial<InputProps> => {
      return {
        ...register(name as keyof ForgotPasswordModalForm),
        type: isFieldVisible[name] ? 'text' : 'password',
        actionButton: {
          children: isFieldVisible[name] ? 'Hide' : 'Show',
          dontFocusOnClick: true,
          icon: isFieldVisible[name] ? <SvgActionHide /> : <SvgActionShow />,
          onClick: () => setIsFieldVisible((fields) => ({ ...fields, [name]: !fields[name] })),
        },
      }
    },
    [isFieldVisible, register]
  )

  return (
    <AuthenticationModalStepTemplate hasNavigatedBack={false} title="Change password" subtitle="Set your new password.">
      <GapContainer>
        <FormField label="New password" error={formState.errors.NewPasswordStep?.password?.message}>
          <Input placeholder="Password" {...getInputProps(`${ForgotPasswordStep.NewPasswordStep}.password`)} />
        </FormField>
        <FormField label="Repeat password" error={formState.errors.NewPasswordStep?.confirmPassword?.message}>
          <Input
            placeholder="Confirm password"
            {...getInputProps(`${ForgotPasswordStep.NewPasswordStep}.confirmPassword`)}
          />
        </FormField>
        <PasswordCriterias path={`${ForgotPasswordStep.NewPasswordStep}.password`} />
      </GapContainer>
    </AuthenticationModalStepTemplate>
  )
}
