import React from 'react'

import { Text } from '@/components/Text'

import { RadioAndCheckboxLabel, StyledHelperText } from './RadioAndCheckboxBase.styles'

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
