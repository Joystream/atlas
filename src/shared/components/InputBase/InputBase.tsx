import React from 'react'
import { FormGroup, HelperText } from './InputBase.styles'

export type InputBaseProps = {
  label?: string
  error?: boolean
  warning?: boolean
  helperText?: string
  disabled?: boolean
}
const getVariant = (warning?: boolean, error?: boolean) => {
  if (error) {
    return 'error'
  }
  if (warning && !error) {
    return 'warning'
  }
}

const InputBase: React.FC<InputBaseProps> = ({ children, helperText = '\u00A0', warning, error, disabled }) => {
  return (
    <FormGroup disabled={disabled}>
      {children}
      <HelperText helperTextVariant={getVariant(warning, error)}>{helperText}</HelperText>
    </FormGroup>
  )
}

export default InputBase
