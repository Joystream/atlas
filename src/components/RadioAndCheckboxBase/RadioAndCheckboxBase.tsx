import React from 'react'

import { RadioAndCheckboxLabel, StyledHelperText } from './RadioAndCheckboxBase.styles'

import { Text } from '../Text'

type RadioAndCheckboxBaseProps = {
  disabled?: boolean
  className?: string
  label?: string
  helperText?: string
  error?: boolean
}

export const RadioAndCheckboxBase: React.FC<RadioAndCheckboxBaseProps> = ({
  disabled,
  children,
  label,
  helperText,
  error,
  className,
}) => {
  return (
    <RadioAndCheckboxLabel disabled={disabled} className={className}>
      {children}
      {label && (
        <Text variant="body2" secondary={disabled}>
          {label}
        </Text>
      )}
      {helperText && <StyledHelperText helperText={helperText} error={error} />}
    </RadioAndCheckboxLabel>
  )
}
