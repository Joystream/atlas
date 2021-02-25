import React, { forwardRef } from 'react'
import InputBase, { InputBaseProps, LabelText } from '../InputBase'
import { TextInput } from './TextField.style'

export type TextFieldProps = {
  name?: string
  type?: 'text' | 'email' | 'password' | 'search'
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
} & InputBaseProps

const TextFieldComponent: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (
  { name, type = 'text', label, value, onChange, onBlur, onFocus, error, disabled, required, ...inputBaseProps },
  ref
) => {
  return (
    <InputBase error={error} disabled={disabled} {...inputBaseProps}>
      <label>
        <TextInput
          ref={ref}
          name={name}
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
