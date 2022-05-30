import React from 'react'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import { RadioAndCheckboxLabel, StyledHelperText } from './RadioAndCheckboxBase.styles'

type RadioAndCheckboxBaseProps = {
  disabled?: boolean
  className?: string
  label?: string
  helperText?: string
  error?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export const RadioAndCheckboxBase: React.FC<RadioAndCheckboxBaseProps> = ({
  disabled,
  children,
  label,
  helperText,
  error,
  className,
  onClick,
}) => {
  return (
    <RadioAndCheckboxLabel hasLabel={!!label} disabled={disabled} className={className} onClick={onClick}>
      {children}
      {label && (
        <Text variant="t200" secondary={disabled}>
          {label}
        </Text>
      )}
      {helperText && (
        <StyledHelperText variant="t100" color={error ? cVar('colorTextError') : undefined} secondary>
          {helperText}
        </StyledHelperText>
      )}
    </RadioAndCheckboxLabel>
  )
}
