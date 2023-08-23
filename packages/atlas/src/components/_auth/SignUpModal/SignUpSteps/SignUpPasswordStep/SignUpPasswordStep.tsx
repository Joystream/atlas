import { zodResolver } from '@hookform/resolvers/zod'
import { FC, RefObject, useCallback, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { AccountFormData } from '@/hooks/useCreateMember'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { passwordAndRepeatPasswordSchema } from '@/utils/formValidationOptions'

import { StyledSignUpForm } from '../SignUpSteps.styles'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type PasswordStepForm = {
  password: string
  confirmPassword: string
}

type SignUpPasswordStepProps = {
  onPasswordSubmit: (password: string) => void
  password?: string
  dialogContentRef?: RefObject<HTMLDivElement>
} & SignUpStepsCommonProps &
  Pick<AccountFormData, 'password'>

export const SignUpPasswordStep: FC<SignUpPasswordStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  password,
  dialogContentRef,
  onPasswordSubmit,
}) => {
  const form = useForm<PasswordStepForm>({
    shouldFocusError: true,
    defaultValues: {
      password,
      confirmPassword: password,
    },
    resolver: zodResolver(passwordAndRepeatPasswordSchema),
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form
  const [hidePasswordProps] = useHidePasswordInInput()
  const [hideConfirmPasswordProps] = useHidePasswordInInput()

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onPasswordSubmit(data.password)
    })()
  }, [handleSubmit, onPasswordSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Sign up',
      onClick: handleGoToNextStep,
    })
  }, [handleGoToNextStep, setPrimaryButtonProps])

  // used to scroll the form to the bottom upon first handle field focus - this is done to let the user see password requirements
  const hasDoneInitialScroll = useRef(false)

  return (
    <FormProvider {...form}>
      <AuthenticationModalStepTemplate
        title="Sign up"
        hasNavigatedBack={hasNavigatedBack}
        subtitle="Please note that there is no option for us to recover your password if you forget it."
      >
        <StyledSignUpForm>
          <FormField label="Password" error={errors.password?.message}>
            <Input
              data-ls-disabled
              placeholder="Password"
              {...register('password')}
              {...hidePasswordProps}
              autoComplete="off"
              onClick={() => {
                if (hasDoneInitialScroll.current || !dialogContentRef?.current) return
                hasDoneInitialScroll.current = true
                dialogContentRef.current.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: 'smooth' })
              }}
            />
          </FormField>
          <FormField label="Repeat Password" error={errors.confirmPassword?.message}>
            <Input
              data-ls-disabled
              placeholder="Repeat password"
              {...register('confirmPassword')}
              {...hideConfirmPasswordProps}
              autoComplete="off"
            />
          </FormField>
          <PasswordCriterias />
        </StyledSignUpForm>
      </AuthenticationModalStepTemplate>
    </FormProvider>
  )
}
