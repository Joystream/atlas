import { zodResolver } from '@hookform/resolvers/zod'
import { FC, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { SvgActionHide, SvgActionShow } from '@/assets/icons'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'
import { AccountFormData } from '@/hooks/useCreateMember'
import { passwordAndRepeatPasswordSchema } from '@/utils/formValidationOptions'

import { StyledSignUpForm } from '../SignUpSteps.styles'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type PasswordStepForm = {
  password: string
  confirmPassword: string
}
type PasswordInputNames = keyof PasswordStepForm

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
  const [isFieldVisible, setIsFieldVisible] = useState<Record<PasswordInputNames, boolean>>({
    password: false,
    confirmPassword: false,
  })

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onPasswordSubmit(data.password)
    })()
  }, [handleSubmit, onPasswordSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Sign up',
      onClick: () => handleGoToNextStep(),
    })
  }, [handleGoToNextStep, setPrimaryButtonProps])

  // used to scroll the form to the bottom upon first handle field focus - this is done to let the user see password requirements
  const hasDoneInitialScroll = useRef(false)

  const handleTogglePassword = (name: PasswordInputNames) => {
    setIsFieldVisible((fields) => ({ ...fields, [name]: !fields[name] }))
  }

  const getInputProps = useCallback(
    (name: PasswordInputNames): InputProps => {
      return {
        ...register(name),
        type: isFieldVisible[name] ? 'text' : 'password',
        actionButton: {
          children: isFieldVisible[name] ? 'Hide' : 'Show',
          dontFocusOnClick: true,
          icon: isFieldVisible[name] ? <SvgActionHide /> : <SvgActionShow />,
          onClick: () => handleTogglePassword(name),
        },
      }
    },
    [isFieldVisible, register]
  )

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
              placeholder="Password"
              {...getInputProps('password')}
              autoComplete="off"
              onClick={() => {
                if (hasDoneInitialScroll.current || !dialogContentRef?.current) return
                hasDoneInitialScroll.current = true
                dialogContentRef.current.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: 'smooth' })
              }}
            />
          </FormField>
          <FormField label="Repeat Password" error={errors.confirmPassword?.message}>
            <Input placeholder="Repeat password" {...getInputProps('confirmPassword')} autoComplete="off" />
          </FormField>
          <PasswordCriterias />
        </StyledSignUpForm>
      </AuthenticationModalStepTemplate>
    </FormProvider>
  )
}
