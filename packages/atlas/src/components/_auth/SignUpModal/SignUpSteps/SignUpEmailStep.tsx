import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { absoluteRoutes } from '@/config/routes'

import { CheckboxWrapper, StyledLink, StyledSignUpForm } from './SignUpSteps.styles'
import { SignUpStepsCommonProps } from './SignUpSteps.types'

import { AuthenticationModalStepTemplate } from '../../AuthenticationModalStepTemplate'
import { SignUpFormData } from '../SignUpModal.types'

const zodSchema = z
  .object({
    email: z.string().min(3, { message: 'Enter email address.' }).email({ message: 'Enter valid email address.' }),
    confirmEmail: z
      .string()
      .min(1, { message: 'Enter email address.' })
      .email({ message: 'Enter valid email address.' }),
    confirmedTerms: z.boolean().refine((value) => value, { message: 'Agree to Terms and Conditions to continue.' }),
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
  onEmailSubmit: (email: string, confirmedTerms: boolean) => void
  isEmailAlreadyTakenError?: boolean
  isOverflowing: boolean
} & SignUpStepsCommonProps &
  Pick<SignUpFormData, 'email' | 'confirmedTerms'>

export const SignUpEmailStep: FC<SignUpEmailStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  isEmailAlreadyTakenError,
  isOverflowing,
  onEmailSubmit,
  confirmedTerms,
  email,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmailStepForm>({
    criteriaMode: 'all',
    resolver: zodResolver(zodSchema),
    shouldFocusError: true,
    defaultValues: {
      confirmedTerms: confirmedTerms || false,
      confirmEmail: email,
      email: email,
    },
  })

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onEmailSubmit(data.email, data.confirmedTerms)
    })()
  }, [handleSubmit, onEmailSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: isEmailAlreadyTakenError ? 'Sign up' : 'Continue',
      onClick: handleGoToNextStep,
    })
  }, [handleGoToNextStep, isEmailAlreadyTakenError, setPrimaryButtonProps])

  return (
    <AuthenticationModalStepTemplate
      hasNegativeBottomMargin
      title="Sign up"
      hasNavigatedBack={hasNavigatedBack}
      subtitle="If you misspell your email address, please note that there is no option for us to recover your account."
    >
      <StyledSignUpForm additionalPaddingBottom={!isOverflowing}>
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
    </AuthenticationModalStepTemplate>
  )
}
