import { FC, RefObject } from 'react'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { PasswordForm } from '@/components/_auth/PasswordForm/PasswordForm'

import { SignUpFormData } from '../../SignUpModal.types'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type SignUpPasswordStepProps = {
  onPasswordSubmit: (password: string) => void
  password?: string
  dialogContentRef?: RefObject<HTMLDivElement>
} & SignUpStepsCommonProps &
  Pick<SignUpFormData, 'password'>

export const SignUpPasswordStep: FC<SignUpPasswordStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  password,
  dialogContentRef,
  onPasswordSubmit,
}) => {
  return (
    <AuthenticationModalStepTemplate
      title="Sign up"
      hasNavigatedBack={hasNavigatedBack}
      subtitle="Please note that there is no option for us to recover your password if you forget it."
    >
      <PasswordForm
        onPasswordSubmit={onPasswordSubmit}
        setPrimaryButtonProps={setPrimaryButtonProps}
        dialogContentRef={dialogContentRef}
        password={password}
      />
    </AuthenticationModalStepTemplate>
  )
}
