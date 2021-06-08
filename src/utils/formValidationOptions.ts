import { isValid } from 'date-fns'
import { ValidationRule, Message, Validate } from 'react-hook-form'

type RegisterOptions = Partial<{
  required: Message | ValidationRule<boolean>
  min: ValidationRule<number | string>
  max: ValidationRule<number | string>
  maxLength: ValidationRule<number | string>
  minLength: ValidationRule<number | string>
  pattern: ValidationRule<RegExp>
  validate: Validate | Record<string, Validate>
}>

type TextValidationArgs = {
  name: string
  maxLength: number
  minLength?: number
  required?: boolean
  pattern?: RegExp
  patternMessage?: string
  validate?: Validate
}

export const textFieldValidation = ({
  name,
  minLength = 0,
  maxLength,
  required = false,
  pattern,
  patternMessage,
  validate,
}: TextValidationArgs): RegisterOptions => ({
  required: {
    value: required,
    message: `${name} cannot be empty`,
  },
  minLength: {
    value: minLength,
    message: `${name} must be at least ${minLength} characters`,
  },
  maxLength: {
    value: maxLength,
    message: `${name} cannot be longer than ${maxLength} characters`,
  },
  ...(pattern
    ? {
        pattern: {
          value: pattern,
          message: patternMessage ? `${name} ${patternMessage}` : `${name} must be valid`,
        },
      }
    : {}),
  validate,
})

export const requiredValidation: (name: string) => RegisterOptions = (name) => ({
  required: {
    value: true,
    message: `${name} must be selected`,
  },
})

// Validates DD/MM/YYYY formatted dates
export const pastDateValidation = (date: Date, required = false) => {
  if (!date) return !required

  if (!isValid(date)) return false

  const currentDate = new Date()
  return currentDate >= date
}
