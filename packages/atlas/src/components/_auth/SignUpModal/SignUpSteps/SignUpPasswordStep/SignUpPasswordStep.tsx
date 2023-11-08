import HCaptcha from '@hcaptcha/react-hcaptcha'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, RefObject, useCallback, useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { atlasConfig } from '@/config'
import { AccountFormData } from '@/hooks/useCreateMember'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { passwordAndRepeatPasswordSchema } from '@/utils/formValidationOptions'

import { StyledSignUpForm } from '../SignUpSteps.styles'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type PasswordStepForm = {
  password: string
  confirmPassword: string
  captchaToken?: string
}

type SignUpPasswordStepProps = {
  onPasswordSubmit: (password: string, captchaToken?: string) => void
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
    reValidateMode: 'onSubmit',
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
    control,
    trigger,
  } = form
  const [hidePasswordProps] = useHidePasswordInInput()
  const [hideConfirmPasswordProps] = useHidePasswordInInput()

  const captchaRef = useRef<HCaptcha | null>(null)
  const captchaInputRef = useRef<HTMLDivElement | null>(null)

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onPasswordSubmit(data.password, data.captchaToken)
    })()
    captchaRef.current?.resetCaptcha()
  }, [handleSubmit, onPasswordSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Sign up',
      onClick: handleGoToNextStep,
    })
  }, [handleGoToNextStep, setPrimaryButtonProps])

  useEffect(() => {
    if (errors.captchaToken) {
      captchaInputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.captchaToken])

  // used to scroll the form to the bottom upon first handle field focus - this is done to let the user see password requirements & captcha
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
          {atlasConfig.features.members.hcaptchaSiteKey && (
            <Controller
              control={control}
              name="captchaToken"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <FormField error={error?.message} ref={captchaInputRef}>
                  <HCaptcha
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    sitekey={atlasConfig.features.members.hcaptchaSiteKey!}
                    theme="dark"
                    languageOverride="en"
                    ref={captchaRef}
                    onVerify={(token) => {
                      onChange(token)
                      trigger('captchaToken')
                    }}
                  />
                </FormField>
              )}
            />
          )}
        </StyledSignUpForm>
      </AuthenticationModalStepTemplate>
    </FormProvider>
  )
}
