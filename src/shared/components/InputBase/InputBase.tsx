import React from 'react'
import { FormGroup, HelperText, LabelText } from './InputBase.styles'

export type InputBaseProps = {
  error?: boolean
  warning?: boolean
  helperText?: string
  disabled?: boolean
  className?: string
  label?: string
  isSelect?: boolean
}
export const getVariant = (warning?: boolean, error?: boolean) => {
  if (error) {
    return 'error'
  }
  if (warning && !error) {
    return 'warning'
  }
}

const InputBase: React.FC<InputBaseProps> = ({
  children,
  helperText = '\u00A0',
  warning,
  error,
  disabled,
  className,
  label,
  isSelect,
}) => {
  return (
    // Select component needs to have own label
    <FormGroup as={isSelect ? 'div' : 'label'} disabled={disabled} className={className} error={error}>
      <LabelText>{label}</LabelText>
      {children}
      <HelperText helperTextVariant={getVariant(warning, error)}>{helperText}</HelperText>
    </FormGroup>
  )
}

export default InputBase
