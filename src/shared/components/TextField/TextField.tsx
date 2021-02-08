import React, { forwardRef } from 'react'
import InputBase, { InputBaseProps, LabelText } from '../InputBase'
import { TextInput } from './TextField.style'

export type TextFieldProps = {
  type?: 'text' | 'email' | 'password' | 'search'
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  required?: boolean
} & InputBaseProps

const TextFieldComponent: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (
  { type = 'text', label, helperText, value, onChange, onBlur, onFocus, error, warning, disabled, required },
  ref
) => {
  return (
    <InputBase helperText={helperText} error={error} warning={warning} disabled={disabled}>
      <label>
        <TextInput
          ref={ref}
          value={value}
          disabled={disabled}
          error={error}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={label}
          type={type}
          required={required}
          tabIndex={disabled ? -1 : 0}
        />
        <LabelText>{label}</LabelText>
      </label>
    </InputBase>
  )
}

const TextField = forwardRef(TextFieldComponent)

TextField.displayName = 'TextField'

export default TextField
