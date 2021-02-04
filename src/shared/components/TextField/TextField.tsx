import React, { forwardRef, useState } from 'react'
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

const TextField: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (
  { type = 'text', label, helperText, value, onChange, onBlur, onFocus, error, warning, disabled, required },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus && onFocus(e)
    setIsFocused(true)
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur && onBlur(e)
    setIsFocused(false)
  }

  return (
    <InputBase helperText={helperText} error={error} warning={warning} disabled={disabled}>
      <label>
        <TextInput
          value={value}
          filled={!!value}
          focused={isFocused}
          disabled={disabled}
          error={!!error}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label}
          type={type}
          required={required}
          ref={ref}
          tabIndex={disabled ? -1 : 0}
        />
        <LabelText>{label}</LabelText>
      </label>
    </InputBase>
  )
}

TextField.displayName = 'TextField'

export default forwardRef(TextField)
