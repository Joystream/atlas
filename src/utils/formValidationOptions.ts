import { ValidationRule, Message, Validate } from 'react-hook-form'
import { isValid } from 'date-fns'

type RegisterOptions = Partial<{
  required: Message | ValidationRule<boolean>
  min: ValidationRule<number | string>
  max: ValidationRule<number | string>
  maxLength: ValidationRule<number | string>
  minLength: ValidationRule<number | string>
  pattern: ValidationRule<RegExp>
  validate: Validate | Record<string, Validate>
}>

export const textFieldValidation: (
  name: string,
  minLength: number,
  maxLength: number,
  required?: boolean
) => RegisterOptions = (name, minLength, maxLength, required = false) => ({
  required: {
    value: required,
    message: `${name} cannot be empty`,
  },
  minLength: {
    value: minLength,
    message: `${name} must be at least ${minLength} characters.`,
  },
  maxLength: {
    value: maxLength,
    message: `${name} cannot be longer than ${maxLength} characters.`,
  },
})

export const requiredValidation: (name: string) => RegisterOptions = (name) => ({
  required: {
    value: true,
    message: `${name} must be selected`,
  },
})

export const urlValidation: (name: string) => RegisterOptions = (name) => ({
  pattern: {
    value: /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
    message: `${name} must be a valid url`,
  },
})

// Validates DD/MM/YYYY formatted dates
export const pastDateValidation = (date: Date, required = false) => {
  if (!date) return !required

  if (!isValid(date)) return false

  const currentDate = new Date()
  return currentDate >= date
}
