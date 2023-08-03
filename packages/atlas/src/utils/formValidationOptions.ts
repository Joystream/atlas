import { isValid } from 'date-fns'
import { RegisterOptions, Validate } from 'react-hook-form'
import { z } from 'zod'

type TextValidationArgs = {
  name: string
  maxLength: number
  minLength?: number
  required?: boolean
  pattern?: RegExp
  patternMessage?: string
  validate?: Validate<string, object>
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
export const pastDateValidation = (date: Date | null, required = false) => {
  if (!date) return !required

  if (!isValid(date)) return false

  const currentDate = new Date()
  return currentDate >= date
}
export const passwordAndRepeatPasswordSchema = z
  .object({
    password: z
      .string()
      .min(9, { message: 'Password has to meet requirements.' })
      .max(64, { message: 'Password has to meet requirements.' }),
    confirmPassword: z.string(),
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
  .refine(
    (data) =>
      !!data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)?.length,
    {
      path: ['password'],
      message: 'Password has to meet requirements.',
    }
  )
