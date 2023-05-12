import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SvgActionCheck, SvgActionClose, SvgActionHide, SvgActionMinus, SvgActionShow } from '@/assets/icons'
import { IconWrapper } from '@/components/IconWrapper'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'
import { cVar } from '@/styles'

import {
  PasswordRequirementItem,
  PasswordRequirementsList,
  PasswordRequirementsWrapper,
} from './SignUpPasswordStep.styles'

import { SignInModalStepTemplate } from '../SignInModalStepTemplate'
import { StyledSignUpForm } from '../SignInSteps.styles'

type PasswordStepForm = {
  password: string
  repeatPassword: string
}
type PasswordInputNames = keyof PasswordStepForm

export const SignUpPasswordStep = () => {
  const { register } = useForm<PasswordStepForm>()
  const [isFieldVisible, setIsFieldVisible] = useState<Record<PasswordInputNames, boolean>>({
    password: false,
    repeatPassword: false,
  })

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
          icon: isFieldVisible[name] ? <SvgActionHide /> : <SvgActionShow />,
          onClick: () => handleTogglePassword(name),
        },
      }
    },
    [isFieldVisible, register]
  )

  return (
    <SignInModalStepTemplate
      title="Sign up"
      hasNavigatedBack={false}
      subtitle="Please note that there is no option for us to recover your password if you forget it."
    >
      <StyledSignUpForm>
        <FormField label="Password">
          <Input placeholder="Password" {...getInputProps('password')} autoComplete="new-password" />
        </FormField>
        <FormField label="Repeat Password">
          <Input placeholder="Repeat password" {...getInputProps('repeatPassword')} autoComplete="new-password" />
        </FormField>
        <PasswordRequirementsWrapper>
          <Text as="h2" variant="h200">
            Password must:
          </Text>
          <PasswordRequirementsList>
            <PasswordCriteria validationState="pending" text="Be between 9 and 64 character" />
            <PasswordCriteria validationState="pending" text="Include an uppercase character" />
            <PasswordCriteria validationState="pending" text="Include a number" />
            <PasswordCriteria validationState="pending" text="Include a special character (eg. !, ?, %)" />
          </PasswordRequirementsList>
        </PasswordRequirementsWrapper>
      </StyledSignUpForm>
    </SignInModalStepTemplate>
  )
}

type ValidationState = 'pending' | 'success' | 'error'

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
