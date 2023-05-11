import { Controller, useForm } from 'react-hook-form'

import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { absoluteRoutes } from '@/config/routes'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { CheckboxWrapper, StyledLink, StyledSignUpForm } from './SignInSteps.styles'

type EmailStepForm = {
  email: string
  repeatedEmail: string
  confirmedTerms: boolean
}

export const SignUpEmailStep = () => {
  const { register, control } = useForm<EmailStepForm>()

  return (
    <SignInModalStepTemplate
      title="Sign up"
      hasNavigatedBack={false}
      subtitle="If you misspell your email address, please note that there is no option for us to recover your account."
    >
      <StyledSignUpForm>
        <FormField {...register('email')} label="Email">
          <Input placeholder="Email" />
        </FormField>
        <FormField {...register('repeatedEmail')} label="Repeat email">
          <Input placeholder="Repeat email" />
        </FormField>
        <Controller
          control={control}
          name="confirmedTerms"
          render={({ field: { onChange, value } }) => (
            <CheckboxWrapper isAccepted={value}>
              <Checkbox
                onChange={(val) => onChange(val)}
                value={value}
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
