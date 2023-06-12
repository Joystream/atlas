import { zodResolver } from '@hookform/resolvers/zod'
import { FC, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SvgActionCheck, SvgActionClose, SvgActionHide, SvgActionMinus, SvgActionShow } from '@/assets/icons'
import { IconWrapper } from '@/components/IconWrapper'
import { Text } from '@/components/Text'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'
import { AccountFormData } from '@/hooks/useCreateMember'
import { cVar } from '@/styles'

import {
  PasswordRequirementItem,
  PasswordRequirementsList,
  PasswordRequirementsWrapper,
} from './SignUpPasswordStep.styles'

import { StyledSignUpForm } from '../SignUpSteps.styles'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

const commonPasswordValidation = z
  .string()
  .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).*$/, { message: 'Password has to meet requirements.' })
  .min(9, { message: 'Password has to meet requirements.' })

const zodSchema = z
  .object({
    password: commonPasswordValidation,
    confirmPassword: commonPasswordValidation,
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      path: ['confirmPassword'],
      message: 'Password address has to match.',
    }
  )

type PasswordStepForm = {
  password: string
  confirmPassword: string
}
type PasswordInputNames = keyof PasswordStepForm

type ValidationState = 'pending' | 'success' | 'error'

type PasswordRequirementsErrors = {
  length: ValidationState
  upperCase: ValidationState
  number: ValidationState
  specialCharacter: ValidationState
}

const PASSWORD_REQUIREMENTS_ERRORS_INITIAL_STATE: PasswordRequirementsErrors = {
  length: 'pending',
  upperCase: 'pending',
  number: 'pending',
  specialCharacter: 'pending',
}

const getValidationState = (isError: boolean) => {
  if (isError) {
    return 'error'
  } else {
    return 'success'
  }
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
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordStepForm>({
    shouldFocusError: true,
    defaultValues: {
      password,
      confirmPassword: password,
    },
    resolver: zodResolver(zodSchema),
  })
  const [isFieldVisible, setIsFieldVisible] = useState<Record<PasswordInputNames, boolean>>({
    password: false,
    confirmPassword: false,
  })

  const [passwordRequirementsErrors, setPasswordRequirementsErrors] = useState<PasswordRequirementsErrors>(
    PASSWORD_REQUIREMENTS_ERRORS_INITIAL_STATE
  )
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

  useEffect(() => {
    const subscription = watch(({ password }) => {
      if (!password) {
        setPasswordRequirementsErrors(PASSWORD_REQUIREMENTS_ERRORS_INITIAL_STATE)
        return
      }

      setPasswordRequirementsErrors(() => ({
        length: getValidationState(password.length <= 9),
        number: getValidationState(/^[^0-9]*$/.test(password)),
        upperCase: getValidationState(/^[^A-Z]*$/.test(password)),
        specialCharacter: getValidationState(/^[^!@#$%^&*()_+]*$/.test(password)),
      }))
    })
    return () => subscription.unsubscribe()
  }, [watch])

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
        <PasswordRequirementsWrapper>
          <Text as="h2" variant="h200">
            Password must:
          </Text>
          <PasswordRequirementsList>
            <PasswordCriteria
              validationState={passwordRequirementsErrors.length}
              text="Be between 9 and 64 character"
            />
            <PasswordCriteria
              validationState={passwordRequirementsErrors.upperCase}
              text="Include an uppercase character"
            />
            <PasswordCriteria validationState={passwordRequirementsErrors.number} text="Include a number" />
            <PasswordCriteria
              validationState={passwordRequirementsErrors.specialCharacter}
              text="Include a special character (eg. !, ?, %)"
            />
          </PasswordRequirementsList>
        </PasswordRequirementsWrapper>
      </StyledSignUpForm>
    </AuthenticationModalStepTemplate>
  )
}

type PasswordCriteriaProps = {
  validationState: ValidationState
  text: string
}

const getIconWrapperProps = (state: ValidationState) => {
  switch (state) {
    case 'pending':
      return {
        backgroundColor: undefined,
        icon: <SvgActionMinus />,
      }
    case 'success':
      return {
        backgroundColor: cVar('colorBackgroundSuccess'),
        icon: <SvgActionCheck />,
      }
    case 'error':
      return {
        backgroundColor: cVar('colorBackgroundError'),
        icon: <SvgActionClose />,
      }
  }
}

const PasswordCriteria: FC<PasswordCriteriaProps> = ({ text, validationState }) => {
  const iconWrapperProps = getIconWrapperProps(validationState)
  return (
    <PasswordRequirementItem as="li" color="colorText" variant="t200">
      <IconWrapper size="small" {...iconWrapperProps} /> {text}
    </PasswordRequirementItem>
  )
}
