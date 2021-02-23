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

export const textFieldValidation: (name: string, min: number, max: number) => RegisterOptions = (name, min, max) => ({
  required: {
    value: true,
    message: `${name} cannot be empty`,
  },
  minLength: {
    value: min,
    message: `${name} must be longer than ${min} characters.`,
  },
  maxLength: {
    value: max,
    message: `${name} cannot be longer than ${max} characters.`,
  },
})

export const requiredValidation: (name: string) => RegisterOptions = (name) => ({
  required: {
    value: true,
    message: `${name} must be selected`,
  },
})
