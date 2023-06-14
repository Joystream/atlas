import { get } from 'lodash-es'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { SvgActionCheck, SvgActionClose, SvgActionMinus } from '@/assets/icons'
import { IconWrapper } from '@/components/IconWrapper'
import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import {
  PasswordRequirementItem,
  PasswordRequirementsList,
  PasswordRequirementsWrapper,
} from './PasswordCriterias.styles'

type ValidationState = 'pending' | 'success' | 'error'

type PasswordRequirementsErrors = {
  length: ValidationState
  upperCase: ValidationState
  number: ValidationState
  specialCharacter: ValidationState
}

const getValidationState = (isError: boolean) => {
  if (isError) {
    return 'error'
  } else {
    return 'success'
  }
}

const PASSWORD_REQUIREMENTS_ERRORS_INITIAL_STATE: PasswordRequirementsErrors = {
  length: 'pending',
  upperCase: 'pending',
  number: 'pending',
  specialCharacter: 'pending',
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

export const PasswordCriteria: FC<PasswordCriteriaProps> = ({ text, validationState }) => {
  const iconWrapperProps = getIconWrapperProps(validationState)
  return (
    <PasswordRequirementItem as="li" color="colorText" variant="t200">
      <IconWrapper size="small" {...iconWrapperProps} /> {text}
    </PasswordRequirementItem>
  )
}

export const PasswordCriterias = ({ path = 'password' }: { path?: string }) => {
  const context = useFormContext()
  const [passwordRequirementsErrors, setPasswordRequirementsErrors] = useState<PasswordRequirementsErrors>(
    PASSWORD_REQUIREMENTS_ERRORS_INITIAL_STATE
  )

  if (!context) {
    throw new Error('PasswordCriterias can be used only within FormProvider with password as field')
  }
  const { watch } = context

  useEffect(() => {
    const subscription = watch((fields) => {
      const password = get(fields, path)
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
  }, [path, watch])

  return (
    <PasswordRequirementsWrapper>
      <Text as="h2" variant="h200">
        Password must:
      </Text>
      <PasswordRequirementsList>
        <PasswordCriteria validationState={passwordRequirementsErrors.length} text="Be between 9 and 64 character" />
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
  )
}
