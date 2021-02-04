import React from 'react'
import { FormGroup, HelperText } from './InputBase.styles'

export type InputBaseProps = {
  label?: string
  error?: string
  disabled?: boolean
  warning?: string
  helperText?: string
}

const InputBase: React.FC<InputBaseProps> = ({
  children,
  helperText = '\u00A0',
  warning = '',
  error = '',
  disabled,
}) => {
  return (
    <FormGroup disabled={disabled}>
      {children}
      {error && <HelperText helperTextVariant="error">{error}</HelperText>}
      {warning && !error && <HelperText helperTextVariant="warning">{warning}</HelperText>}
      {!warning && !error && <HelperText>{helperText}</HelperText>}
    </FormGroup>
  )
}

export default InputBase
