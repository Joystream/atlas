import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { absoluteRoutes } from '@/config/routes'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { CheckboxWrapper, StyledLink, StyledSignUpForm } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

const zodSchema = z
  .object({
    email: z.string().min(3, { message: 'Enter email address' }).email({ message: 'Enter valid email address' }),
    confirmEmail: z.string().min(1, { message: 'Enter email address' }).email({ message: 'Enter valid email address' }),
    confirmedTerms: z.literal(true, { errorMap: () => ({ message: 'Agree to Terms and Conditions to continue.' }) }),
  })
  .refine(
    (data) => {
      return data.email === data.confirmEmail
    },
    {
      path: ['confirmEmail'],
      message: 'Email address has to match.',
    }
  )

type EmailStepForm = z.infer<typeof zodSchema>

type SignUpEmailStepProps = {
  onEmailSubmit: (email: string) => void
} & SignInStepProps

export const SignUpEmailStep: FC<SignUpEmailStepProps> = ({
  goToNextStep,
  setPrimaryButtonProps,
  hasNavigatedBack,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmailStepForm>({
    criteriaMode: 'all',
    resolver: zodResolver(zodSchema),
    defaultValues: {
      confirmedTerms: undefined,
      confirmEmail: '',
      email: '',
    },
  })

  const handleGoToNextStep = useCallback(() => {
    handleSubmit(() => {
      goToNextStep()
    })()
  }, [goToNextStep, handleSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => handleGoToNextStep(),
    })
  }, [goToNextStep, handleGoToNextStep, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Sign up"
      hasNavigatedBack={hasNavigatedBack}
      subtitle="If you misspell your email address, please note that there is no option for us to recover your account."
    >
      <StyledSignUpForm>
        <FormField label="Email" error={errors.email?.message}>
          <Input {...register('email')} placeholder="Email" error={!!errors.email} />
        </FormField>
        <FormField label="Repeat email" error={errors.confirmEmail?.message}>
          <Input {...register('confirmEmail')} placeholder="Repeat email" error={!!errors.email} />
        </FormField>
        <Controller
          control={control}
          name="confirmedTerms"
          render={({ field: { onChange, value } }) => (
            <CheckboxWrapper isAccepted={value}>
              <Checkbox
                error={!!errors.confirmedTerms}
                onChange={(val) => onChange(val)}
                value={value}
                caption={errors.confirmedTerms?.message}
                label={
                  <>
                    I have read and agree to{' '}
                    <StyledLink href={absoluteRoutes.legal.termsOfService()} target="_blank">
                      Terms and conditions
                    </StyledLink>
                  </>
                }
              />
            </CheckboxWrapper>
          )}
        />
      </StyledSignUpForm>
    </SignInModalStepTemplate>
  )
}
